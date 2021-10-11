import { creaateReadme } from "./create-readme";
import { FigmaColorFormat } from "@design-sdk/figma";
import { reflectColorToFigmaColor } from "@design-sdk/figma-node-conversion";

/**
 * the empty space is for hiding following text from figma's page hierarchy.
 * user can change the icon, spacing, but not the token for regex validation.
 */
const PRIMARY_ASSISTANT_VISUAL_STORE_PAGE_NAME =
  "📕                                                                                       __storage__ (assistant.grida.co/primary)";
const PRIMARY_ASSISTANT_VISUAL_STORE_PAGE_NAME_REGEX = /__storage__([\w ]+)\(assistant.grida.co\/primary\)/g;
export function createPrimaryVisualStorePageIfNonExists() {
  const document = figma.currentPage.parent as DocumentNode;
  const existing = document.findChild((x) =>
    RegExp(PRIMARY_ASSISTANT_VISUAL_STORE_PAGE_NAME_REGEX).test(x.name)
  );
  if (existing) {
    //
  } else {
    const page = figma.createPage();
    document.insertChild(document.children.length, page); // add to last
    page.name = PRIMARY_ASSISTANT_VISUAL_STORE_PAGE_NAME;
    page.backgrounds = [
      <SolidPaint>{
        type: "SOLID",
        color: reflectColorToFigmaColor("#1E1E1E", FigmaColorFormat.rgb),
      },
    ];

    creaateReadme({ at: page });
  }
}
