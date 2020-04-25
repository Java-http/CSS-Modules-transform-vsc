import * as vscode from 'vscode';
import {transform,getConf} from './utils';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "CSS-Modules-transform" is now active!');
		
	const conf = getConf();

	let disposable = vscode.commands.registerCommand('CSS-Modules-transform.cssModulesTransform', (rest) => {
		// Get the active text editor
		let editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;
			let selection = editor.selection;

			// Get the word within the selection
			let word = document.getText(selection);
			let reversed = transform(word,conf);

			editor.edit(editBuilder => {
				editBuilder.replace(selection, reversed);
			});
		}
	});
	

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
