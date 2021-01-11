import { Typography, CircularProgress, Fade } from "@material-ui/core";
import * as React from "react";
import "./preview.css";

interface Props {
  data: Uint8Array;
  name: string;
  type?: string;
}

interface State {
  url: string;
}
export class Preview extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
    };
  }

  componentDidMount() {}

  get url(): string {
    if (this.props.data) {
      var blob = new Blob([this.props.data], { type: "image/png" });
      var url = URL.createObjectURL(blob);
      return url;
    }
  }

  render() {
    const unselectedLogo = require("./assets/preview-unselected.svg") as string;

    let render = this.url ? (
      <img
        className="render"
        alt={this.props.name}
        src={this.url}
        width="100%"
        height="200px"
      />
    ) : (
      <div className="render">
        <div className="inner-render">
          <img src={unselectedLogo} alt="unSelected-logo" />
          <Typography className="rendering-notify">
            Nothing is selected
          </Typography>
        </div>
      </div>
    );

    return (
      <div className="preview">
        <Typography variant="caption">{this.props.type}</Typography>
        {render}
      </div>
    );
  }
}
