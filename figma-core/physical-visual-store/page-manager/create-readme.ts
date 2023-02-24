import { renderText } from "../../reflect-render/text.render";

export async function creaateReadme({
  at,
  afterMoving = false,
}: {
  at: PageNode;
  afterMoving?: boolean;
}): Promise<FrameNode> {
  if (afterMoving) {
    figma.currentPage = at;
  }
  const readmeframe = figma.createFrame();
  at.insertChild(0, readmeframe);
  readmeframe.name = "README";
  readmeframe.resize(1440, 900);
  readmeframe.x = 0;
  readmeframe.y = 0;
  readmeframe.locked = true;

  //
  readmeframe.insertChild(0, await createInitialReadmeText());
  //
  return readmeframe;
}

async function createInitialReadmeText() {
  const font = {
    family: "Helvetica Neue",
    style: "Regular",
  };
  await figma.loadFontAsync(font);
  const readmeText = await renderText({
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien felis, volutpat ut cursus nec, euismod vel dolor. Vestibulum et purus eget ligula tempus scelerisque eget ut mi. Curabitur quam augue, vulputate et mi imperdiet, scelerisque posuere ligula. Sed finibus, turpis ultrices mollis aliquet, ipsum lacus pulvinar sapien, sit amet fringilla ante augue sit amet leo. Curabitur dapibus finibus quam, sit amet rhoncus augue pharetra id. Sed eget laoreet ex. Integer convallis orci massa, ac convallis libero tempor ut.",
    fontName: font,
    fontSize: 14,
    color: "#111111",
  });
  readmeText.x = 24;
  readmeText.y = 24;
  readmeText.resize(1392, 100);

  return readmeText;
}
