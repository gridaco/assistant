import Button from "@material-ui/core/Button";
import * as React from "react";

export class ToolboxScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  hideAllExceptText = (e) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "hide-all-except",
          data: { except: "TEXT" },
        },
      },
      "*"
    );
  };

  hideAllOnlyText = (e) => {
    parent.postMessage(
      { pluginMessage: { type: "hide-all-only", data: { only: "TEXT" } } },
      "*"
    );
  };

  onClickRandomize(e) {
    parent.postMessage({ pluginMessage: { type: "randomize-selection" } }, "*");
  }

  onClickOpenConsole(e) {
    open("https://bridged.xyz/");
  }
  render() {
    return (
      <div>
        <p>dev tools</p>
        <Button variant="outlined">font replacer</Button>
        <Button onClick={this.hideAllExceptText}>hide all except text</Button>
        <Button onClick={this.hideAllOnlyText}>hide only text</Button>
        <Button onClick={this.onClickRandomize}>randomize</Button>
        <Button onClick={this.onClickOpenConsole}>open in console</Button>
      </div>
    );
  }
}
