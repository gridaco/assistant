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
import {
  designToFlutter,
  designToReact,
  designToVanilla,
} from "./design-to-code";
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
      const transportableImageAssetRepository = await repo_assets.MainImageRepository.instance
        .get("fill-later-assets")
        .makeTransportable();
      figma.ui.postMessage({
        type: EK_IMAGE_ASSET_REPOSITORY_MAP,
        data: transportableImageAssetRepository,
      });
    };

    // generate vanilla preview source ------------------
    let vanilla_preview_source;
    if (req.config.do_generate_vanilla_preview_source) {
      const vanilla_res = await designToVanilla(rnode);
      vanilla_preview_source = vanilla_res.scaffold.raw;
    }
    // --------------------------------------------------

    if (codePlatform == "flutter") {
      const flutterBuild = await designToFlutter(rnode, hostingjob);
      post_cb({
        code: flutterBuild.code,
        app: flutterBuild.scaffold,
        vanilla_preview_source: vanilla_preview_source,
      });
    } else if (codePlatform == "react") {
      const reactBuild = await designToReact(rnode);
      post_cb({
        code: reactBuild.code,
        app: reactBuild.scaffold,
        vanilla_preview_source: vanilla_preview_source,
      });
    }
  } else {
    console.warn("user requested linting, but non selected to run lint on.");
  }
  //#endregion
}

function post_cb(data: { code; app; vanilla_preview_source }) {
  figma.ui.postMessage({
    type: EK_GENERATED_CODE_PLAIN,
    data: data,
  });
}
