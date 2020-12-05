import * as React from "react";
import { IconsLoader } from "./icons-loader";
import Button from "@material-ui/core/Button";



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
            <Button onClick={this.akav}>AKAV this project for test</Button>
        </div>
    }

    akav() {

    }
}