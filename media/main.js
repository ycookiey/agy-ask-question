// Webview用スクリプト
(function() {
    const vscode = acquireVsCodeApi();

    // DOM要素の参照
    const loadingDiv = document.getElementById('loading');
    const questionContainer = document.getElementById('question-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    // 古い状態の復元（もしあれば）
    const previousState = vscode.getState();
    if (previousState && previousState.question) {
        renderQuestion(previousState.question);
    }

    // メッセージの受信
    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'newQuestion':
                renderQuestion(message.value);
                vscode.setState({ question: message.value });
                break;
        }
    });

    // 質問の描画
    function renderQuestion(questionData) {
        if (!questionData) return;

        loadingDiv.style.display = 'none';
        questionContainer.style.display = 'block';

        questionText.textContent = questionData.text || "No question provided";
        optionsContainer.innerHTML = ''; // クリア

        if (questionData.options && Array.isArray(questionData.options)) {
            questionData.options.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = option.label || option;
                
                // 説明文がある場合
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

    // 回答の送信
    function sendAnswer(value) {
        vscode.postMessage({
            type: 'answer',
            value: value
        });
        
        // 送信後のUI更新（一時的）
        questionContainer.style.display = 'none';
        loadingDiv.style.display = 'block';
        loadingDiv.textContent = 'Answer submitted. Waiting for next tasks...';
    }
}());
