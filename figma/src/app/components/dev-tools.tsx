import * as React from "react";
import { IconsLoader } from "./icons-loader";



export class DevTools extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    hideAllExceptText = (e) => {
        parent.postMessage({ pluginMessage: { type: 'hide-all-except', data: { except: "TEXT" } } }, '*')
    }

    hideAllOnlyText = (e) => {
        parent.postMessage({ pluginMessage: { type: 'hide-all-only', data: { only: "TEXT" } } }, '*')
    }

    onClickRandomize(e) {
        parent.postMessage({ pluginMessage: { type: 'randomize-selection' } }, '*')
    }


    onClickOpenConsole(e) {
        open("https://bridged.xyz/");
    }
    render() {
        return <div>
            <p>dev tools</p>
            <button onClick={this.hideAllExceptText}>hide all except text</button>
            <button onClick={this.hideAllOnlyText}>hide only text</button>
            <button onClick={this.onClickRandomize}>randomize</button>
            <button onClick={this.onClickOpenConsole}>open in console</button>
            <div><IconsLoader /></div>
        </div>
    }
}