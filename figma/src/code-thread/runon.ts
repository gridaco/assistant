import { runLints } from "@designto/clean";

import {
  EK_COMPUTE_STARTED,
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
  EK_LINT_FEEDBACK,
  EK_VANILLA_TRANSPORT,
} from "app/lib/constants/ek.constant";
import { vanilla, repo_assets } from "@design-sdk/core";
import { ReflectFrameNode, ReflectSceneNode } from "@design-sdk/core/nodes";
import { designToFlutter, designToReact } from "./design-to-code";
import { userInterestUnset, user_interest } from "./user-interest";
import { broadcastSelectionPreview } from "./broadcast-selection-preview";
import { singleFigmaNodeSelection } from "./selection";

export async function runon(rnode: ReflectSceneNode) {
  console.log(
    `handling main runon function targetting to user interest - "${user_interest}"`
  );

  // region
  // notify ui that the computing process has been started.
  // use this for when displaying loading indicator etc.. for general purpose.
  figma.ui.postMessage({
    type: EK_COMPUTE_STARTED,
    data: {
      mode: user_interest,
    },
  });
  // endregion

  // if converted node returned nothing
  if (!rnode) {
    figma.notify(
      'not a valid selection. this node is ignored with name : "//@ignore"'
    );
    return;
  }

  //#region  run linter
  if (userInterestUnset() || user_interest == "lint") {
    const feedbacks = runLints(rnode);
    console.warn(feedbacks);
    figma.ui.postMessage({
      type: EK_LINT_FEEDBACK,
      data: feedbacks,
    });
  }
  //#endregion

  // region make vanilla
  if (user_interest == "g11n" || user_interest == "exporter") {
    const globalizatoinScreen = vanilla.makeVanilla(rnode as ReflectFrameNode);
    const vanillaTransportableImageRepository =
      await globalizatoinScreen.repository.makeTransportable();
    figma.ui.postMessage({
      type: EK_IMAGE_ASSET_REPOSITORY_MAP,
      data: vanillaTransportableImageRepository,
    });
    figma.ui.postMessage({
      type: EK_VANILLA_TRANSPORT,
      data: globalizatoinScreen,
    });
  }
  // endregion

  if (userInterestUnset() || user_interest.startsWith("code")) {
    const codePlatform = (() => {
      switch (user_interest) {
        case "code/react":
          return "react";
        case "code":
          return "flutter"; // currently default mode is flutter due to flutter is default legacy.
        case "code/flutter":
          return "flutter";
      }
      throw `unrecognized user_interest givven "${user_interest}"`;
    })();

    const hostingjob = async () => {
      // host images
      const transportableImageAssetRepository =
        await repo_assets.MainImageRepository.instance.current.makeTransportable();
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
  }

  // send preview image
  broadcastSelectionPreview(singleFigmaNodeSelection);
}
