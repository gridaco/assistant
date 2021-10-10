import { repo_assets } from "@design-sdk/core";
import {
  ImageRepository,
  MainImageRepository,
} from "@design-sdk/core/assets-repository";
import type { ReflectSceneNode } from "@design-sdk/figma-node";
import { ImageRepositories } from "@design-sdk/figma/asset-repository";
import { flutter, react, token, vanilla, designToCode } from "@designto/code";
import { config, output, react as react_config } from "@designto/config";

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

type InterceptorJobProcessor = () => Promise<any>;
type InterceptorAssetRepositoryJobProcessor = () => Promise<repo_assets.TransportableImageRepository>;

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
  reflectDesign: ReflectSceneNode,
  jobs?: InterceptorJobProcessor
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

/**
 * returns vanilla html code with fixed size with no overflow
 * @param reflectDesign
 * @param jobs
 * @returns
 */
export async function designToFixedPreviewVanilla(
  reflectDesign: ReflectSceneNode,
  jobs?: InterceptorAssetRepositoryJobProcessor
): Promise<O> {
  setup_image_repository();
  const vanilla = await designToCode({
    input: {
      name: reflectDesign.name,
      id: reflectDesign.id,
      design: reflectDesign,
    },
    framework: <config.VanillaFrameworkConfig>{
      framework: "vanilla",
      language: "html",
    },
    build_config: {
      force_root_widget_fixed_size_no_scroll: true,
    },
    asset_config: {
      // the asset replacement on assistant is handled on ui thread.
      skip_asset_replacement: true,
    },
  });
  await jobs?.();

  return vanilla;
}
