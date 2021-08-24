import { repo_assets } from "@design-sdk/core";
import { composeAppWithHome } from "@bridged.xyz/flutter-builder";
import { Widget } from "@bridged.xyz/flutter-builder";
import { hosting, types } from "@base-sdk/base";
export async function wrap_with_hosting__flutter(
  id: string,
  scene: Widget | string
) {
  const imagesMaps = await repo_assets.ImageHostingRepository.hostImages();
  const dartSource = composeAppWithHome(scene, {
    withReplacements: imagesMaps,
  });

  // console.info('the final app code for quicklook is...', dartSource)
  const uploaded = await hosting.upload({
    file: dartSource,
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
    executable: dartSource,
    url: url,
  };
}
