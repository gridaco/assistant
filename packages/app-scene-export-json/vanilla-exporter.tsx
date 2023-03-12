import { VanillaSceneTransport } from "@base-sdk/base";
import Button from "@material-ui/core/Button";
import React from "react";
import * as repo_assets from "@design-sdk/asset-repository";
import {
  EK_COMPUTE_STARTED,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
  EK_VANILLA_TRANSPORT,
} from "@core/constant/ek.constant";
import { downloadFile } from "./export-utils";
import copy from "copy-to-clipboard";

interface State {
  loading: boolean;
  vanilla: VanillaSceneTransport;
}

export class VanillaExporter extends React.Component<any, State> {
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
      case EK_COMPUTE_STARTED:
        this.setState(() => {
          return {
            loading: true,
          };
        });

      case EK_VANILLA_TRANSPORT:
        this.setState(() => {
          return {
            loading: false,
            vanilla: msg.data as VanillaSceneTransport,
          };
        });
        break;

      case EK_IMAGE_ASSET_REPOSITORY_MAP:
        const imageRepo = msg.data as repo_assets.TransportableImageRepository;
        repo_assets.ImageHostingRepository.setRepository(imageRepo);
        break;
    }
  };

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
            downloadFile(JSON.stringify(this.state.vanilla, null, 4))
          }
        >
          export to json file
        </Button>
        <Button
          onClick={() => copy(JSON.stringify(this.state.vanilla, null, 4))}
        >
          copy json
        </Button>
      </div>
    );
  }
}
