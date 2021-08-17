import { PluginSdk } from "@plugin-sdk/app";

/**
 * Target platform this ui runs on. this gloval variable will be set on initial entry on each platform's main ui import
 */
export let TARGET_PLATFORM: TargetPlatform;

/**
 * this only sets TARGET_PLATFORM on ui thread.
 * @param platform
 */
export async function initializeTargetPlatform(platform: TargetPlatform) {
  TARGET_PLATFORM = platform;
  if (platform == TargetPlatform.webdev) {
    return true;
  }

  // sync this to code side.
  await PluginSdk.request({
    namespace: "__INTERNAL__",
    key: "sync-target-platform",
    data: platform,
  });
  console.info(`thread#ui: target platform set as ${platform}`);
}

export function __syncTargetPlatformForCodeThread(
  platform: TargetPlatform
): boolean {
  console.info(`thread#code: syncing target platform to ${platform}`);
  TARGET_PLATFORM = platform;
  return true;
}

export enum TargetPlatform {
  bridged = "xyz.bridged.bridged",
  figma = "com.figma.Desktop",
  sketch = "com.bohemiancoding.sketch3",
  xd = "xd",
  zeplin = "zeplin",
  webdev = "xyz.bridged.assistant-web-dev",
}
