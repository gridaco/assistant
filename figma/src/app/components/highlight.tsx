import * as React from "react";
import {
  default as PrismHighlight,
  defaultProps,
  Language,
} from "prism-react-renderer";
import copy from "copy-to-clipboard";
import "./highlight.css";

// region custom dart support
// https://github.com/FormidableLabs/prism-react-renderer/issues/22#issuecomment-553042928
import Prism from "prism-react-renderer/prism";
import dartLang from "refractor/lang/dart";
import { EK_COPIED } from "../constants/ek.constant";
import { quickLook } from "../../quicklook";
import { Widget } from "@bridged.xyz/flutter-builder/lib";
import { notify } from "@bridged.xyz/design-sdk/lib/figma";
import Button from "@material-ui/core/Button";
dartLang(Prism);
// endregion

interface State {
  isLaunchingConsole: boolean;
}

interface Props {
  language: Language | any;
  app: string;
  widget: Widget;
  code: string;
}

export default class Highlight extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isLaunchingConsole: false,
    };
  }

  onCopyClicked = (e) => {
    copy(this.props.code);
    parent.postMessage({ pluginMessage: { type: EK_COPIED } }, "*");
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
        notify(parent, "quick look ready !");
      })
      .catch((e) => {
        console.error(e);
        setLoadingState(false);
        notify(parent, "compile failed. view console for details.", 2);
      });
  };

  render() {
    return (
      <code>
        <div>
          <div style={{ height: "24px" }} />
          <Button
            variant="outlined"
            size="medium"
            className="sticky-actions"
            onClick={this.onCopyClicked}
          >
            copy code
          </Button>
          <Button
            variant="outlined"
            size="medium"
            className="sticky-actions"
            disabled={this.state.isLaunchingConsole}
            onClick={this.onQuickLookClicked}
          >
            {this.state.isLaunchingConsole ? "launching.." : "quick look"}
          </Button>
        </div>
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
    );
  }
}
