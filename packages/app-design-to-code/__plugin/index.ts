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
  designToFixedPreviewVanilla,
  designToVanilla,
} from "./design-to-code";
import { FigmaNodeCache } from "figma-core/node-cache";
import { Framework } from "@grida/builder-platform-types";
import * as repo_assets from "@design-sdk/asset-repository";
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
        case Framework.vanilla:
          return "vanilla";
        default:
          return "flutter"; // currently default mode is flutter due to flutter is default legacy.
      }
      throw `unrecognized user_interest givven "${req.option.framework}"`;
    })();

    const asset_export_job = async (
      mode: /**
       * full fetch
       */
      | "full"
        /**
         * preview fetch - as the actual size.
         */
        | "preview-only" = "full"
    ): Promise<repo_assets.TransportableImageRepository> => {
      const transportable_config_map = {
        full: undefined,
        "preview-only": "original",
      };
      const transportable_config = { type: transportable_config_map[mode] };
      // host images
      const transportableImageAssetRepository =
        await repo_assets.MainImageRepository.instance
          .get("fill-later-assets")
          .makeTransportable(transportable_config);
      figma.ui.postMessage({
        type: EK_IMAGE_ASSET_REPOSITORY_MAP,
        data: transportableImageAssetRepository,
      });
      return transportableImageAssetRepository;
    };

    // generate vanilla preview source ------------------
    let vanilla_preview_source;
    if (req.config.do_generate_vanilla_preview_source) {
      const vanilla_res = await designToFixedPreviewVanilla(rnode, () => {
        return asset_export_job("preview-only");
      });
      vanilla_preview_source = vanilla_res.scaffold.raw;
    }
    // --------------------------------------------------
    switch (codePlatform) {
      case "vanilla": {
        const vanillaBuild = await designToVanilla(rnode);
        post_cb({
          name: vanillaBuild.name,
          code: vanillaBuild.code,
          app: vanillaBuild.scaffold,
          vanilla_preview_source: vanilla_preview_source,
        });
        break;
      }
      case "react": {
        const reactBuild = await designToReact(rnode);
        post_cb({
          name: reactBuild.name,
          code: reactBuild.code,
          app: reactBuild.scaffold,
          vanilla_preview_source: vanilla_preview_source,
        });
        break;
      }
      case "flutter": {
        const flutterBuild = await designToFlutter(rnode, asset_export_job);
        post_cb({
          name: flutterBuild.name,
          code: flutterBuild.code,
          app: flutterBuild.scaffold,
          vanilla_preview_source: vanilla_preview_source,
        });
        break;
      }
    }
  } else {
    console.warn("user requested linting, but non selected to run lint on.");
  }
  //#endregion
}

function post_cb(data: {
  code;
  app;
  vanilla_preview_source: string;
  name: string;
}) {
  figma.ui.postMessage({
    type: EK_GENERATED_CODE_PLAIN,
    data: data,
  });
}
