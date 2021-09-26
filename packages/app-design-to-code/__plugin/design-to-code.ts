import {
  ImageRepository,
  MainImageRepository,
} from "@design-sdk/core/assets-repository";
import type { ReflectSceneNode } from "@design-sdk/figma-node";
import { ImageRepositories } from "@design-sdk/figma/asset-repository";
import { flutter, react, token } from "@designto/code";

interface GenerationResultToUI {
  tokens?: any;
  widget: any;
  app: any;
}

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
) {
  setup_image_repository();
  const buildResult = flutter.buildApp(reflectDesign);

  // execution order matters.
  // this will be fixed by having a builder instance. (currently non available)
  await jobs();

  const widget = buildResult.widget;
  const app = flutter.makeApp({
    widget: widget,
    scrollable: buildResult.scrollable,
  });

  return <GenerationResultToUI>{
    widget: widget,
    app: app,
  };
}

export function designToReact(reflectDesign: ReflectSceneNode) {
  setup_image_repository();
  const tokens = token.tokenize(reflectDesign);
  const widget = react.buildReactWidget(tokens);
  const app = react.buildReactApp(widget, {
    template: "cra",
  });

  return <GenerationResultToUI>{
    tokens: tokens,
    widget: widget,
    app: app.code,
  };
}

export function designToCode() {
  throw "not implemented";
}
