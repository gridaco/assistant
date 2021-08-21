import { composeAppWithHome } from "@bridged.xyz/flutter-builder";
import { Widget } from "@bridged.xyz/flutter-builder";
import { features, hosting, types } from "@base-sdk/base";
import { repo_assets } from "@design-sdk/core";
import { PluginSdk } from "@plugin-sdk/app";

export async function quickLook(id: string, app: Widget | string) {
  console.log("quicklook starting..");

  console.log(
    "imageRepostory",
    repo_assets.ImageHostingRepository.imageRepostory
  );
  const imagesMaps = await repo_assets.ImageHostingRepository.hostImages();
  console.log("imagesMaps", imagesMaps);
  const dartSource = composeAppWithHome(app, {
    withReplacements: imagesMaps,
  });

  // replace url as real one
  // dartSource.replace()

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
  console.log("uploaded!");
  // const compiled = await compileComplete(dartSource)
  // const uploaded = await upload(`${id}.js`, new Blob([compiled.result]))
  const quicklookUrl = features.quicklook.buildConsoleQuicklookUrl({
    id: id,
    name: "flutter-example",
    framework: types.AppFramework.flutter,
    language: types.AppLanguage.dart,
    url: url,
  });
  PluginSdk.openUri(quicklookUrl);
  console.log("launched!", quicklookUrl);
}
