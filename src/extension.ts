import * as vscode from 'vscode';
import {transform,getConf} from './utils';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "CSS-Modules-transform" is now active!');
		
	const conf = getConf();

	let disposable = vscode.commands.registerCommand('CSS-Modules-transform.cssModulesTransform', (rest) => {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		const Selection = vscode.Selection;
		const Position = vscode.Position;

		if (editor) {
			let document = editor.document;
			let selection = editor.selection;

			// Get the word within the selection
			let word = document.getText(selection);

			// 如果没有选中文本,则默认选中当前行
			if(word === ''){
				let line = selection.active.line;
				let lineSelection = new Selection(new Position(line,0),new Position(line+1,0));
				let lineWord = document.getText(lineSelection);
				let reversed = transform(lineWord,conf);

				editor.edit(editBuilder => {
					editBuilder.replace(lineSelection, reversed);
				});
				
				return;
			}

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
