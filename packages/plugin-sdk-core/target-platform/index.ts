/**
 * Target platform this ui runs on. this gloval variable will be set on initial entry on each platform's main ui import
 */
let TARGET_PLATFORM: TargetPlatform;

export const target_platform = {
  get: (): TargetPlatform => TARGET_PLATFORM,
  set: (value: TargetPlatform) => {
    TARGET_PLATFORM = value;
  },
};

export enum TargetPlatform {
  bridged = "xyz.bridged.bridged",
  figma = "com.figma.Desktop",
  sketch = "com.bohemiancoding.sketch3",
  xd = "xd",
  zeplin = "zeplin",
  webdev = "xyz.bridged.assistant-web-dev",
}
