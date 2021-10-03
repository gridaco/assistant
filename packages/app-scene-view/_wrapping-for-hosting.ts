import { repo_assets } from "@design-sdk/core";
import { composeAppWithHome, Widget } from "@flutter-builder/flutter";
import { hosting, types } from "@base-sdk/base";
import * as flutter from "@flutter-builder/flutter";
import { formatCode as formatDart } from "dart-style";

export async function wrap_with_hosting__flutter(
  id: string,
  // we use finalized string at this point.
  scene: Widget | string
) {
  const imagesMaps = await repo_assets.ImageHostingRepository.hostImages();
  if (scene instanceof flutter.Widget) {
    scene = composeAppWithHome(scene, {
      withReplacements: imagesMaps,
      custom_branding_content: undefined,
    });
  }

  // final code formatting - do again even if it's already done.
  scene = formatDart(scene).code;

  // console.info('the final app code for quicklook is...', dartSource)
  const uploaded = await hosting.upload({
    file: scene,
    name: id,
  });
  const url = uploaded.url;

  // const url = await buildAndHostSimpleApp({
  //     dart: dartSource,
  //     id: id,
  //     short: true
  // })
  // const compiled = await compileComplete(dartSource)
  // const uploaded = await upload(`${id}.js`, new Blob([compiled.result]))

  return {
    id: id,
    name: "flutter-example",
    framework: types.AppFramework.flutter,
    language: types.AppLanguage.dart,
    executable: scene,
    url: url,
  };
}
