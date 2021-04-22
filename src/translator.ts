import axios from 'axios'
import * as vscode from 'vscode'
import * as Constants from './constants';

export class Translator {
    private outputChannel: vscode.OutputChannel

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Translator')
    }

    public async translate() {
        const editor = vscode.window.activeTextEditor
        if(!editor) return

        const selection = editor.selection
        const text = selection.isEmpty ? editor.document.getText() : editor.document.getText(editor.selection)

        await vscode.window.withProgress({
            title: 'Translating',
            location: vscode.ProgressLocation.Notification,
            }, async () => {
                const target = await Translator.translate(text, true)
                if(!target) return

                this.outputChannel.show()
                this.outputChannel.appendLine(target)
                this.outputChannel.appendLine('\n')
            }
        )
    }

    public async replaceWithTranslation() {
        const editor = vscode.window.activeTextEditor
        if(!editor) return

        const selection = editor.selection
        if(selection.isEmpty) return

        //获取选中的文本
        const text = editor.document.getText(editor.selection)
        if(text) {
            await vscode.window.withProgress({
                title: 'Replacing with Translation',
                location: vscode.ProgressLocation.Notification,
            }, async () => {
                const target = await Translator.translate(text, true)
                if(!target) return
          
                await editor.edit(editBuilder => {
                  editBuilder.replace(selection, target)
                })
            })
        }
    }

    public static async translate(source: string, showErrorMessage: boolean = false): Promise<string> {
        try {
            const result = (await axios.get(`https://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=${encodeURIComponent(source)}`)).data
            const ret = result['translateResult'].map((translateResult: any) => translateResult.map((sentence: any) => sentence['tgt']).join('')).join('\n')
            if(ret && /^[ a-zA-Z]+$/.test(ret)) {
                // 小驼峰
                const firstUpperCase = ([first, ...rest]: string) => first.toUpperCase() + rest.join('')
                const arr = ret.split(' ')
                return arr.map((item: string, index: number) => {
                    if(index === 0) {
                        return item.toLocaleLowerCase()
                    } else {
                        return firstUpperCase(item)
                    }
                }).join('')
            }
            return ret
        } catch(error) {
            if(showErrorMessage) {
                vscode.window.showErrorMessage(error.toString())
            }
        
            return ''
        }
    }
}