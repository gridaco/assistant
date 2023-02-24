export async function renderImage({
  name,
  src,
  width: _force_width,
  height: _force_height,
}: {
  name: string;
  width?: number;
  height?: number;
  src: string;
}): Promise<RectangleNode> {
  try {
    const image = await figma.createImageAsync(src);

    // Create node
    const node = figma.createRectangle();

    if (_force_width && _force_height) {
      node.resize(_force_height, _force_height);
    } else {
      // Resize the node to match the image's width and height
      const { width, height } = await image.getSizeAsync();
      node.resize(width, height);
    }

    // Set the name on the node
    node.name = name ?? "Untitled Image";

    // Set the fill on the node
    node.fills = [
      {
        type: "IMAGE",
        imageHash: image.hash,
        scaleMode: "FILL",
      },
    ];

    return node;
  } catch (e) {
    figma.notify("Error: " + e);
  }
}
