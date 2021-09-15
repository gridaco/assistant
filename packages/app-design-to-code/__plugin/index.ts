import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
} from "@core/constant/ek.constant";
import {
  onService,
  _Code_Event,
  _APP_EVENT_CODE_GEN_RESULT_EK,
  CodeGenRequest,
} from "./events";
import { designToFlutter, designToReact } from "./design-to-code";
import { FigmaNodeCache } from "figma-core/node-cache";
import { Framework } from "@grida/builder-platform-types";
import { repo_assets } from "@design-sdk/core";
onService(main_cb);

// main callback
function main_cb(evt: _Code_Event) {
  // to logic

  switch (evt.type) {
    case "code-gen-request":
      _handle_code_gen_request(evt);
      break;
  }
}

async function _handle_code_gen_request(req: CodeGenRequest) {
  //#region  run code gen
  const rnode = FigmaNodeCache.getLastConverted();
  if (rnode) {
    const codePlatform = (() => {
      switch (req.option.framework) {
        case Framework.react:
          return "react";
        case Framework.flutter:
          return "flutter";
        default:
          return "flutter"; // currently default mode is flutter due to flutter is default legacy.
      }
      throw `unrecognized user_interest givven "${req.option.framework}"`;
    })();

    const hostingjob = async () => {
      // host images
      const transportableImageAssetRepository = await repo_assets.MainImageRepository.instance.current.makeTransportable();
      figma.ui.postMessage({
        type: EK_IMAGE_ASSET_REPOSITORY_MAP,
        data: transportableImageAssetRepository,
      });
    };

    //@ts-ignore
    if (codePlatform == "flutter") {
      const flutterBuild = await designToFlutter(rnode, hostingjob);
      figma.ui.postMessage({
        type: EK_GENERATED_CODE_PLAIN,
        data: {
          code: flutterBuild.widget.build().finalize(),
          app: flutterBuild.app.build().finalize(),
        },
      });
    } else if (codePlatform == "react") {
      const reactBuild = designToReact(rnode);
      figma.ui.postMessage({
        type: EK_GENERATED_CODE_PLAIN,
        data: {
          code: reactBuild.app,
          app: reactBuild.app,
        },
      });
    }
  } else {
    console.warn("user requested linting, but non selected to run lint on.");
  }
  //#endregion
}
