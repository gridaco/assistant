import * as React from "react";
import {
  default as PrismHighlight,
  defaultProps,
  Language,
} from "prism-react-renderer";
import copy from "copy-to-clipboard";
import "./highlight.css";

// #region custom dart support
// https://github.com/FormidableLabs/prism-react-renderer/issues/22#issuecomment-553042928
import Prism from "prism-react-renderer/prism";
import dartLang from "refractor/lang/dart";
dartLang(Prism);
// #endregion

import { quickLook } from "../quicklook";
import { Widget } from "@bridged.xyz/flutter-builder/lib";
import Button from "@material-ui/core/Button";
import { PluginSdk } from "@bridged.xyz/plugin-sdk-react";

interface State {
  isLaunchingConsole: boolean;
}

interface Props {
  language: Language | any;
  code: string;
  app?: string;
  widget?: Widget;
  codeActions?: Array<JSX.Element>;
}

export default class CodeBox extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isLaunchingConsole: false,
    };
  }

  onCopyClicked = (e) => {
    copy(this.props.code);
    PluginSdk.notifyCopied();
  };

  onQuickLookClicked = (e) => {
    const setLoadingState = (loading: boolean) => {
      this.setState((p, s) => {
        return {
          isLaunchingConsole: loading,
        };
      });
    };

    setLoadingState(true);
    quickLook("quicklook", this.props.app)
      .then((r) => {
        setLoadingState(false);
        PluginSdk.notify("quick look ready !");
      })
      .catch((e) => {
        console.error(e);
        setLoadingState(false);
        PluginSdk.notify("compile failed. view console for details.", 2);
      });
  };

  render() {
    return (
      <>
        <code>
          {this.props.codeActions &&
            this.props.codeActions.map((e) => {
              return e;
            })}
          <PrismHighlight
            {...defaultProps}
            Prism={Prism}
            code={this.props.code}
            language={this.props.language}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={className} style={style}>
                {tokens.map((line, i) => (
                  <div {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </PrismHighlight>
        </code>

        <div className="code-info-wrapper">
          <Button className="btn-copy-code" onClick={this.onCopyClicked}>
            copy code
          </Button>
          {this.props.app && (
            <Button
              className="btn-quick-look"
              disabled={this.state.isLaunchingConsole}
              onClick={this.onQuickLookClicked}
            >
              {this.state.isLaunchingConsole ? "launching.." : "quick look"}
            </Button>
          )}
        </div>
      </>
    );
  }
}
