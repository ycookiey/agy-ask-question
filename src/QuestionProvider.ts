import * as vscode from 'vscode';

export class QuestionProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'agyAskView';
	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(async (data) => {
			switch (data.type) {
				case 'answer':
					await this.saveAnswer(data.value);
					break;
			}
		});
	}

	public updateQuestion(questionData: any) {
		if (this._view) {
			this._view.webview.postMessage({ type: 'newQuestion', value: questionData });
		}
	}

	private async saveAnswer(answer: any) {
		if (!vscode.workspace.workspaceFolders) { return; }
		
		const rootPath = vscode.workspace.workspaceFolders[0].uri;
		const answerUri = vscode.Uri.joinPath(rootPath, '.agy', 'answer.json');
		
		const content = new TextEncoder().encode(JSON.stringify(answer, null, 2));
		await vscode.workspace.fs.writeFile(answerUri, content);
		
		vscode.window.showInformationMessage(`Answer saved: ${JSON.stringify(answer)}`);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'style.css'));

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleUri}" rel="stylesheet">
				<title>Ask Agy Question</title>
			</head>
			<body>
				<div id="loading">Waiting for questions...</div>
				<div id="question-container" style="display:none;">
					<h3 id="question-text"></h3>
					<div id="options-container"></div>
				</div>

				<script src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}
