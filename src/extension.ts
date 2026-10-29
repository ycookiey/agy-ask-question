import * as vscode from 'vscode';
import { QuestionProvider } from './QuestionProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "agy-ask-extension" is now active!');

	const provider = new QuestionProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(QuestionProvider.viewType, provider)
	);

	setupFileWatcher(provider);
}

function setupFileWatcher(provider: QuestionProvider) {
	const watcher = vscode.workspace.createFileSystemWatcher('**/.agy/question.json');
	watcher.onDidChange(async (uri) => {
		console.log('Question file changed:', uri.fsPath);
		try {
			const data = await vscode.workspace.fs.readFile(uri);
			const question = JSON.parse(new TextDecoder().decode(data));
			provider.updateQuestion(question);
		} catch (e) {
			console.error('Error reading question.json', e);
		}
	});

	watcher.onDidCreate(async (uri) => {
		console.log('Question file created:', uri.fsPath);
		try {
			const data = await vscode.workspace.fs.readFile(uri);
			const question = JSON.parse(new TextDecoder().decode(data));
			provider.updateQuestion(question);
		} catch (e) {
			console.error('Error reading question.json', e);
		}
	});
}

export function deactivate() {}
