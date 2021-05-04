import { Widget } from "@bridged.xyz/flutter-builder";
import * as React from "react";
import { format } from "../utils/dart-format";
import CodeBox from "../components/codebox";
import { Preview } from "../components/preview";
import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
  EK_PREVIEW_SOURCE,
} from "../constants/ek.constant";
import { repo_assets } from "@design-sdk/core";

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
}

export class CodeScreen extends React.Component<any, State> {
  constructor(props) {
    super(props);
    this.state = {
      code: DEFAULT_EMPTY_CODE_SNIPPET,
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
        case EK_IMAGE_ASSET_REPOSITORY_MAP:
          const imageRepo = msg.data as repo_assets.TransportableImageRepository;
          repo_assets.ImageHostingRepository.setRepository(imageRepo);
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
        <Preview auto />
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
