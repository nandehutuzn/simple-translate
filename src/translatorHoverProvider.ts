import { Hover, HoverProvider, Position, TextDocument } from 'vscode'
import { Translator } from './translator'
import * as vscode from 'vscode'

export class TranslatorHoverProvider implements HoverProvider {
    public async provideHover(document: TextDocument, position: Position): Promise<Hover> {
        const editor = vscode.window.activeTextEditor
        if(!editor) return new Hover('')
  
        const selection = editor.selection
        if(selection.isEmpty) return new Hover('')
  
        const text = editor.document.getText(editor.selection)
        if(text) {
            return new Hover(await Translator.translate(text))
        }
  
        return new Hover('')
    }
}