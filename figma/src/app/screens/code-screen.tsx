import { Widget } from "@bridged.xyz/flutter-builder/lib";
import * as React from "react";
import { TransportableImageRepository } from "../../assets-repository";
import { ImageHostingRepository } from "../../assets-repository/hosting";
import { format } from "../../utils/dart-format";
import Highlight from "../components/highlight";
import { Preview } from "../components/preview";
import { EK_GENERATED_CODE_PLAIN, EK_IMAGE_ASSET_REPOSITORY_MAP, EK_PREVIEW_SOURCE } from "../constants/ek.constant";


interface State {
    app: string,
    code: string,
    widget: Widget,
    previewImage: string,
    name: string
}


export class CodeScreen extends React.Component<any, State> {

    constructor(props) {
        super(props);
        this.state = {
            name: 'not selected',
            code: "//\n//\n//\n// there is no selected node\n//\n//\n//",
            previewImage: null,
            widget: null,
            app: null
        };
    }

    componentDidMount() {
        window.addEventListener("message", this.onMessage);
    }

    onMessage = (ev: MessageEvent) => {
        const msg = ev.data.pluginMessage;
        switch (msg.type) {
            case EK_GENERATED_CODE_PLAIN:
                const app = format(msg.data.app);
                const code = format(msg.data.code);
                const widget = msg.data.widget
                this.setState((state, props) => {
                    return { code: code, widget: widget, app: app };
                });
                break;
            case EK_PREVIEW_SOURCE:
                this.setState((state, props) => {
                    return { previewImage: msg.data.source, name: msg.data.name };
                });
                break;
            case EK_IMAGE_ASSET_REPOSITORY_MAP:
                const imageRepo = msg.data as TransportableImageRepository
                ImageHostingRepository.setRepository(imageRepo)
                break
        }
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.onMessage)
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
            <Highlight language="dart" app={this.state.app} code={(this.state).code} widget={(this.state).widget} ></Highlight>
            <button onClick={this.onClickReportIssue}>
                report issue
      </button>
            <button onClick={this.onClickVisitWebsite}>
                visit website
      </button>
        </div>
    }
}
