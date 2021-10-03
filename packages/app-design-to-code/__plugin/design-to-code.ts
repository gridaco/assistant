import {
  ImageRepository,
  MainImageRepository,
} from "@design-sdk/core/assets-repository";
import type { ReflectSceneNode } from "@design-sdk/figma-node";
import { ImageRepositories } from "@design-sdk/figma/asset-repository";
import { flutter, react, token, vanilla } from "@designto/code";
import { output, react as react_config } from "@designto/config";

// interface GenerationResultToUI {
//   tokens?: any;
//   widget: any;
//   app: any;
// }

type O = output.ComponentOutput;

function setup_image_repository() {
  // ------------------------------------------------------------
  // set image repo for figma platform
  MainImageRepository.instance = new ImageRepositories();
  MainImageRepository.instance.register(
    new ImageRepository(
      "fill-later-assets",
      "grida://assets-reservation/images/"
    )
  );
  // ------------------------------------------------------------
}

type InterceptorJobProcessor = () => Promise<void>;
export async function designToFlutter(
  reflectDesign: ReflectSceneNode,
  jobs: InterceptorJobProcessor
): Promise<O> {
  setup_image_repository();
  const tokens = token.tokenize(reflectDesign);
  const widget = flutter.buildFlutterWidget(tokens);
  const app = flutter.buildFlutterApp(widget);
  // execution order matters.
  // this will be fixed by having a builder instance. (currently non available)
  await jobs();

  return app;
}

export async function designToReact(
  reflectDesign: ReflectSceneNode
): Promise<O> {
  setup_image_repository();
  const tokens = token.tokenize(reflectDesign);
  const widget = react.buildReactWidget(tokens);
  const app = react.buildReactApp(widget, {
    template: "cra",
  });

  await Promise.resolve();

  return app;
}

export async function designToVanilla(
  reflectDesign: ReflectSceneNode
): Promise<O> {
  setup_image_repository();
  const tokens = token.tokenize(reflectDesign);
  const widget = vanilla.buildVanillaWidget(tokens);
  const app = vanilla.buildVanillaFile(widget);
  await Promise.resolve();
  return app;
}

export function designToCode() {
  throw "not implemented";
}
