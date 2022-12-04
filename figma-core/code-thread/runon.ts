import {
  EK_COMPUTE_STARTED,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
  EK_VANILLA_TRANSPORT,
} from "@core/constant/ek.constant";
import { ReflectFrameNode, ReflectSceneNode } from "@design-sdk/figma-node";
import { user_interest } from "./user-interest";
import { broadcastSelectionPreview } from "./broadcast-selection-preview";
import { singleFigmaNodeSelection } from "./selection";

export async function runon(rnode: ReflectSceneNode) {
  // console.log(
  //   `handling main runon function targetting to user interest - "${user_interest}"`
  // );

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

  // TODO: migrate this to __plugin
  // region make vanilla
  // import * as vanilla from "@design-sdk/vanilla";
  // if (user_interest == "g11n" || user_interest == "exporter") {
  //   const globalizatoinScreen = vanilla.makeVanilla(rnode as ReflectFrameNode);
  //   const vanillaTransportableImageRepository = await globalizatoinScreen.repository.makeTransportable();
  //   figma.ui.postMessage({
  //     type: EK_IMAGE_ASSET_REPOSITORY_MAP,
  //     data: vanillaTransportableImageRepository,
  //   });
  //   figma.ui.postMessage({
  //     type: EK_VANILLA_TRANSPORT,
  //     data: globalizatoinScreen,
  //   });
  // }
  // endregion

  // send preview image
  broadcastSelectionPreview(singleFigmaNodeSelection);
}
