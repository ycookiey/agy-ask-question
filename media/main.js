(function() {
    const vscode = acquireVsCodeApi();

    const loadingDiv = document.getElementById('loading');
    const questionContainer = document.getElementById('question-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    // The webview is recreated each time the view is shown again, so restore the last question.
    const previousState = vscode.getState();
    if (previousState && previousState.question) {
        renderQuestion(previousState.question);
    }

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'newQuestion':
                renderQuestion(message.value);
                vscode.setState({ question: message.value });
                break;
        }
    });

    function renderQuestion(questionData) {
        if (!questionData) return;

        loadingDiv.style.display = 'none';
        questionContainer.style.display = 'block';

        questionText.textContent = questionData.text || "No question provided";
        optionsContainer.innerHTML = '';

        if (questionData.options && Array.isArray(questionData.options)) {
            questionData.options.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = option.label || option;

                if (option.description) {
                    const desc = document.createElement('span');
                    desc.className = 'option-desc';
                    desc.textContent = option.description;
                    btn.appendChild(document.createElement('br'));
                    btn.appendChild(desc);
                }

                btn.onclick = () => {
                    sendAnswer(option.value || option.label || option);
                };
                optionsContainer.appendChild(btn);
            });
        }
    }

    function sendAnswer(value) {
        vscode.postMessage({
            type: 'answer',
            value: value
        });

        questionContainer.style.display = 'none';
        loadingDiv.style.display = 'block';
        loadingDiv.textContent = 'Answer submitted. Waiting for next tasks...';
    }
}());
