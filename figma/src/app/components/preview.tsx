import { Typography, CircularProgress, Fade } from "@material-ui/core";
import * as React from "react";
import "./preview.css";
import { setInterval } from "timers";

interface Props {
  data: Uint8Array;
  name: string;
  type?: string;
}

interface State {
  url: string;
  isLoading: boolean;
}
export class Preview extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      isLoading: false,
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

  loadingBox = () => {
    const t = setInterval(() => <div>jhihi</div>, 1000);

    return t;
  };

  render() {
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
        <Typography variant="h4" className="rendering-notify">
          select anything
        </Typography>
      </div>
    );
    let t = this.url ? (
      <div className="preview-loading">
        <CircularProgress />
      </div>
    ) : (
      ""
    );

    return (
      <div className="preview">
        <Typography variant="caption">{this.props.type}</Typography>

        <div className="preview-loading">{this.loadingBox}</div>
        {render}
      </div>
    );
  }
}
