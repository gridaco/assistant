/**
 * file id of bridged design - https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/bridged
 */
export const FIGMA_DEMO_DEFAULT_FILE_ID = "Y0Gh77AqBoHH7dG1GtK3xF";

/**
 * extracts file id from share link
 *
 * e.g. in - "https://www.figma.com/file/Y0Gh77AqBoHH7dG1GtK3xF/bridged?node-id=775%3A112"
 *
 * out - "Y0Gh77AqBoHH7dG1GtK3xF"
 * @param url
 * @returns
 */
export function parseFileIdFromUrl_Figma(url: string) {
  // this logic is dangerous, but clean and simple. works for now. (think the url format won't change)
  if (url.includes("https://www.figma.com/file/")) {
    return url.split("/")[4];
  } else {
    throw `figma file url must contain "https://www.figma.com/file/". the givven was ${url}, which we cannot extract file id from it.`;
  }
}
