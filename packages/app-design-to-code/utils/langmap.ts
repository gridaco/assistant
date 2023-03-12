/**
 * get language by framework (default) (for code display) (non critical)
 *
 * -- used by code view (for styling only - used by highlight js)
 */
export const _src_view_language = (framework: string): string => {
  switch (framework) {
    case "flutter":
      return "dart";
    case "react":
      return "jsx";
    case "vanilla":
      return "html";
    default:
      throw `default language for code display on framework "${framework}" is not supported`;
  }
};
