import {
  ImageRepository,
  MainImageRepository,
  TransportableImageRepository,
} from "@design-sdk/asset-repository";
import type { ReflectSceneNode } from "@design-sdk/figma-node";
import { ImageRepositories } from "@design-sdk/figma/dist/asset-repository";
import { designToCode } from "@designto/code";
import { config, output } from "@grida/builder-config";
import {
  react_presets,
  flutter_presets,
  vanilla_presets,
  preview_presets,
} from "@grida/builder-config-preset";

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
type InterceptorAssetRepositoryJobProcessor =
  () => Promise<TransportableImageRepository>;

export async function designToFlutter(
  reflectDesign: ReflectSceneNode,
  jobs: InterceptorJobProcessor
): Promise<O> {
  setup_image_repository();
  const flutter = await designToCode({
    input: {
      name: reflectDesign.name,
      id: reflectDesign.id,
      entry: reflectDesign,
    },
    framework: flutter_presets.flutter_default,
    build_config: {
      disable_components: true,
    },
    asset_config: {
      // the asset replacement on assistant is handled on ui thread.
      skip_asset_replacement: true,
    },
  });

  // execution order matters.
  // this will be fixed by having a builder instance. (currently non available)
  await jobs();

  return flutter;
}

export async function designToReact(
  reflectDesign: ReflectSceneNode,
  jobs?: InterceptorJobProcessor
): Promise<O> {
  setup_image_repository();

  const reactapp = await designToCode({
    input: {
      name: reflectDesign.name,
      id: reflectDesign.id,
      entry: reflectDesign,
    },
    framework: react_presets.react_default,
    build_config: {
      disable_components: true,
    },
    asset_config: {
      // the asset replacement on assistant is handled on ui thread.
      skip_asset_replacement: true,
    },
  });
  await Promise.resolve();

  return reactapp;
}

export async function designToVanilla(
  reflectDesign: ReflectSceneNode,
  jobs?: InterceptorJobProcessor
): Promise<O> {
  setup_image_repository();

  const vanillaApp = await designToCode({
    input: {
      name: reflectDesign.name,
      id: reflectDesign.id,
      entry: reflectDesign,
    },
    framework: vanilla_presets.vanilla_default,
    build_config: {
      disable_components: true,
    },
    asset_config: {
      // the asset replacement on assistant is handled on ui thread.
      skip_asset_replacement: true,
    },
  });
  await Promise.resolve();

  return vanillaApp;
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

  const build_config = {
    ...config.default_build_configuration,
    disable_components: true,
  };

  const vanilla = await designToCode({
    input: {
      name: reflectDesign.name,
      id: reflectDesign.id,
      entry: reflectDesign,
    },
    framework: preview_presets.default,
    build_config: build_config,
    asset_config: {
      // the asset replacement on assistant is handled on ui thread.
      skip_asset_replacement: true,
    },
  });
  await jobs?.();

  return vanilla;
}
