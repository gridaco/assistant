import { Widget } from "@flutter-builder/flutter";
import { features } from "@base-sdk/base";
import { wrap_with_hosting__flutter } from "./_wrapping-for-hosting";
export async function preview(id: string, app: { raw: string }) {
  console.log("quicklook starting..");

  // replace url as real one
  // dartSource.replace()

  const wrapped = await wrap_with_hosting__flutter(id, app);
  const previewurl = features.scene_preview.buildScenePreviewUrl({
    id: wrapped.id,
    name: wrapped.name,
    framework: wrapped.framework,
    language: wrapped.language,
    url: wrapped.url,
  });
  open(previewurl);
  console.log("launched!", previewurl);
}
