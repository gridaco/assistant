import { Widget } from "@bridged.xyz/flutter-builder/lib";
import * as React from "react";
import { TransportableImageRepository } from "core/lib/assets-repository";
import { ImageHostingRepository } from "core/lib/assets-repository/hosting";
import { format } from "../utils/dart-format";
import CodeBox from "../components/codebox";
import { Preview } from "../components/preview";
import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
  EK_PREVIEW_SOURCE,
} from "../constants/ek.constant";

const DEFAULT_EMPTY_CODE_SNIPPET = `//
//
//
// there is no selected design.
// select your screen or component on figma
//
//
//`;

interface State {
  app: string;
  code: string;
  widget: Widget;
  previewImage: string;
  name: string;
}

export class CodeScreen extends React.Component<any, State> {
  constructor(props) {
    super(props);
    this.state = {
      name: "not selected",
      code: DEFAULT_EMPTY_CODE_SNIPPET,
      previewImage: null,
      widget: null,
      app: null,
    };
  }

  componentDidMount() {
    window.addEventListener("message", this.onMessage);
  }

  onMessage = (ev: MessageEvent) => {
    const msg = ev.data.pluginMessage;
    if (msg) {
      switch (msg.type) {
        case EK_GENERATED_CODE_PLAIN:
          const app = format(msg.data.app);
          const code = format(msg.data.code);
          const widget = msg.data.widget;
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
          const imageRepo = msg.data as TransportableImageRepository;
          ImageHostingRepository.setRepository(imageRepo);
          break;
      }
    } else {
      // ignore
    }
  };

  componentWillUnmount() {
    window.removeEventListener("message", this.onMessage);
  }

  onClickReportIssue(e) {
    open("https://github.com/bridgedxyz/assistant/issues/new/choose");
  }

  onClickVisitWebsite(e) {
    open("https://bridged.xyz/");
  }

  render() {
    return (
      <div>
        <Preview
          data={(this.state as any).previewImage}
          name={(this.state as any).name}
        ></Preview>
        <CodeBox
          language="dart"
          app={this.state.app}
          code={this.state.code}
          widget={this.state.widget}
        ></CodeBox>
        {/* <Button onClick={this.onClickReportIssue}>report issue</Button>
        <Button onClick={this.onClickVisitWebsite}>visit website</Button> */}
      </div>
    );
  }
}
