import * as vscode from 'vscode'
import { TranslatorHoverProvider } from './translatorHoverProvider'
import { Translator } from './translator'


export function activate(context: vscode.ExtensionContext) {

	const translator = new Translator()

	context.subscriptions.push(vscode.languages.registerHoverProvider('*', new TranslatorHoverProvider()))

	context.subscriptions.push(vscode.commands.registerCommand('simple-translate.translate', () => translator.translate()))

	context.subscriptions.push(vscode.commands.registerCommand('simple-translate.replaceWithTranslation', () => translator.replaceWithTranslation()))
}

// this method is called when your extension is deactivated
export function deactivate() {}
