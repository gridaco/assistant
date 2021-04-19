import { VanillaSceneTransport } from "@bridged.xyz/client-sdk/lib";
import Button from "@material-ui/core/Button";
import React from "react";
import { TransportableImageRepository } from "core/lib/assets-repository";
import { ImageHostingRepository } from "core/lib/assets-repository/hosting";
import { eventkeys } from "../../../constants";

interface State {
  loading: boolean;
  vanilla: VanillaSceneTransport;
}

export class ExporterScreen extends React.Component<any, State> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      vanilla: undefined,
    };
  }

  componentDidMount() {
    window.addEventListener("message", this.onMessage);
  }

  onMessage = (ev: MessageEvent) => {
    const msg = ev.data.pluginMessage;

    switch (msg.type) {
      case eventkeys.EK_COMPUTE_STARTED:
        this.setState(() => {
          return {
            loading: true,
          };
        });

      case eventkeys.EK_VANILLA_TRANSPORT:
        this.setState(() => {
          return {
            loading: false,
            vanilla: msg.data as VanillaSceneTransport,
          };
        });
        console.log("vanilla transport receiced from view", msg.data);
        break;

      case eventkeys.EK_IMAGE_ASSET_REPOSITORY_MAP:
        const imageRepo = msg.data as TransportableImageRepository;
        ImageHostingRepository.setRepository(imageRepo);
        break;
    }
  };

  downloadFile(content) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-node.json`;
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  copy(content) {
    var tempElem = document.createElement("textarea");
    tempElem.value = content;
    document.body.appendChild(tempElem);

    tempElem.select();
    document.execCommand("copy");
    document.body.removeChild(tempElem);
  }

  render() {
    return (
      <div>
        <pre>
          {this.state.vanilla
            ? JSON.stringify(this.state.vanilla, null, 4)
            : "nothing to load"}
        </pre>
        <Button
          onClick={() =>
            this.downloadFile(JSON.stringify(this.state.vanilla, null, 4))
          }
        >
          export to json file
        </Button>
        <Button
          onClick={() => this.copy(JSON.stringify(this.state.vanilla, null, 4))}
        >
          copy json
        </Button>
      </div>
    );
  }
}
