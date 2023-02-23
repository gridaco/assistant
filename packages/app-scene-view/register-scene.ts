import { SceneStoreService } from "@base-sdk/scene-store";
import {
  __S_DesignOrigin,
  __S_StorableSceneType,
} from "@base-sdk/scene-store/__api/server-types";
import { getAccessToken } from "@assistant-fp/auth";
import { upload } from "@base-sdk/hosting";
import { nanoid } from "nanoid/non-secure";
import { wrap_with_hosting__flutter } from "./_wrapping-for-hosting";

export async function registerScene(scene: {
  preview: Uint8Array;
  id: string;
  width: number;
  height: number;
  name: string;
  raw: object;
  code?: {
    flutter: {
      app: { raw: string };
    };
  };
}) {
  const _id = nanoid();
  const token = await getAccessToken();
  const service = new SceneStoreService({
    type: "token",
    token: token,
  });

  // upload preview image
  const previewImageUploaded = await upload({
    // @ts-ignore blob
    file: new Blob([scene.preview], {
      type: "image/png",
    }),
    name: `scene-preview-${scene.name}/${scene.id}-w${scene.width}-h${scene.height}.png`,
  });

  const flutter_hosted = await wrap_with_hosting__flutter(
    _id,
    scene.code.flutter.app
  );

  /**
   * FIXME:
   * 1. file checksum for figma is not ready
   * 2. fileid2nodeid unique constraints is not resolved on server side (put api is not ready)
   * 3. so , based on 1 & 2 we are using file id as some thing unique for now. this will cause loss of data after put api & file checksum is ready.
   *
   */
  const registeredScene = await service.register({
    preview: previewImageUploaded.url,
    fileId: nanoid(), // TODO: get fileid
    nodeId: scene.id,
    rawname: scene.name,
    width: scene.width,
    height: scene.height,
    customdata_1p: {
      code: {
        flutter: {
          widget: {
            url: flutter_hosted.url,
            raw: scene.code.flutter.app.raw,
          },
          executable: {
            url: flutter_hosted.url,
            raw: flutter_hosted.executable,
          },
        },
      },
    },
    initialTags: [],
    sceneType: __S_StorableSceneType.ANYNODE,
    from: __S_DesignOrigin.FIGMA_DESKTOP,
    raw: scene.raw ?? {}, // TODO: add raw node data
  });

  return registeredScene;
}
