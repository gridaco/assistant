import { TargetPlatform } from "@plugin-sdk/core";

export function get_target_platform_from_query(platform: string) {
  switch (platform) {
    case "figma":
      return TargetPlatform.figma;
    case "webdev":
      return TargetPlatform.webdev;
  }
}
