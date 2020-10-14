import * as React from "react";
import { format } from "../../utils/dart-format";
import Highlight from "../components/highlight";
import { Preview } from "../components/preview";



export class CodeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = { code: "//\n//\n//\n// there is no selected node\n//\n//\n//", previewImage: null };

    }

    componentDidMount() {

        // subscribe code
        window.onmessage = (ev: MessageEvent) => {


            const msg = ev.data.pluginMessage;

            switch (msg.type) {
                case "result":
                    const code = format(msg.data);
                    this.setState((state, props) => {
                        return { code: code };
                    });
                    break;
                case "preview":
                    this.setState((state, props) => {
                        return { previewImage: msg.data.source, name: msg.data.name };
                    });
                    break;
            }
        }
    }


    onClickReportIssue(e) {
        open("https://github.com/bridgedxyz/assistant/issues/new/choose");
    }

    onClickVisitWebsite(e) {
        open("https://bridged.xyz/");
    }

    render() {
        return <div>
            <Preview data={(this.state as any).previewImage} name={(this.state as any).name}></Preview>
            <Highlight language="dart" code={(this.state as any).code}></Highlight>
            <button onClick={this.onClickReportIssue}>
                report issue
      </button>
            <button onClick={this.onClickVisitWebsite}>
                visit website
      </button>
        </div>
    }
}
