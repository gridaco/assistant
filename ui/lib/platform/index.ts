/**
 * Target platform this ui runs on. this gloval variable will be set on initial entry on each platform's main ui import
 */
export let TARGET_PLATFORM: TargetPlatform;

export function initializeTargetPlatform(platform: TargetPlatform) {
    TARGET_PLATFORM = platform
    console.info(`target platform set as ${platform}`)
}

export enum TargetPlatform {
    bridged = 'xyz.bridged.bridged',
    figma = 'com.figma.Desktop',
    sketch = 'com.bohemiancoding.sketch3',
    xd = 'xd',
    zeplin = 'zeplin',
    webdev = 'xyz.bridged.assistant-web-dev',
}