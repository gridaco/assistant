/**
 * randomize the current selection of text
 * @todo - support other types. (currently only text supported)
 * @returns
 */
export async function randimizeText() {
  if (figma.currentPage.selection.length >= 2) {
    figma.notify("only single node randomize is supported");
    return;
  }

  const primarySelection = figma.currentPage.selection[0];
  if (primarySelection.type == "TEXT") {
    const text = primarySelection as TextNode;
    await figma.loadFontAsync(text.fontName as FontName);
    text.characters =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultrices scelerisque leo nec consectetur. Sed porta metus molestie sollicitudin gravida. Nulla vitae metus sapien.";
  }
  if (
    primarySelection.type == "RECTANGLE" ||
    primarySelection.type == "ELLIPSE"
  ) {
    const box = primarySelection as RectangleNode;
  }
}
