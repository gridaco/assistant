import * as React from "react";
import { ReactBoxSnippetGenerator } from "@bridged.xyz/box";
import Button from "@material-ui/core/Button";

function buildFolderSelector(): HTMLInputElement {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'multiple');
    fileSelector.setAttribute('webkitdirectory', 'webkitdirectory');
    fileSelector.setAttribute('name', 'root');

    return fileSelector;
}

export class BoxDirectoryInput extends React.Component {
    fileSelector: HTMLInputElement;

    componentDidMount() {
        this.fileSelector = buildFolderSelector();
    }

    handleFileSelect = (e) => {
        e.preventDefault();
        this.fileSelector.click();

        this.fileSelector.onchange = (f: Event) => {

            const event = f as any
            const files = event.path[0].files as Array<File>
            console.log(event)

            for (const file of files) {
                if (file.name == "Button.tsx") {
                    readFile(file)
                }
            }
            function readFile(file: File) {
                const reader = new FileReader();
                reader.addEventListener('load', (event) => {
                    // converts base64 octet-stream to plain text
                    const data = event.target.result as string
                    if (data.includes("data:application/octet-stream;base64,")) {
                        const fin = atob((event.target.result as string).replace("data:application/octet-stream;base64,", ''))
                        const res = new ReactBoxSnippetGenerator().process({
                            code: fin,
                            fileName: file.name
                        }).then(r => {
                            console.log("built!", r)
                        })
                    }
                });
                reader.readAsDataURL(file);
            }

        }
    }

    render() {
        return <>
            {/* <input type="file" name="file" multiple /> */}
            <Button onClick={this.handleFileSelect}>Select src dir</Button>
        </>
    }
}