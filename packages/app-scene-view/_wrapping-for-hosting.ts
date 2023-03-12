import * as repo_assets from "@design-sdk/asset-repository";
import { hosting, types } from "@base-sdk/base";
import { finalize_temporary_assets_with_prefixed_static_string_keys__dangerously } from "@code-features/assets";
// import { formatCode as formatDart } from "dart-style";
import { formatCode as formatDart } from "dart-style";

export async function wrap_with_hosting__flutter(
  id: string,
  // we use finalized string at this point.
  scene: { raw: string }
) {
  const imagesMaps = await repo_assets.ImageHostingRepository.hostImages();
  // final code formatting - do again even if it's already done.
  scene.raw =
    finalize_temporary_assets_with_prefixed_static_string_keys__dangerously(
      scene.raw,
      "grida://assets-reservation/images/",
      imagesMaps,
      {
        fallback: "this image cannot be hosted",
      }
    );
  scene.raw = formatDart(scene.raw).code;

  const uploaded = await hosting.upload({
    file: scene.raw,
    name: id,
  });
  const url = uploaded.url;

  return {
    id: id,
    name: "flutter-example",
    framework: types.AppFramework.flutter,
    language: types.AppLanguage.dart,
    executable: scene.raw,
    url: url,
  };
}
