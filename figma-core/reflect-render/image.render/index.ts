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

type ImageReplacement =
  | {
      // use existing image and by its hash
      type: "hash";
      hash: string;
      scaleMode?: ImagePaint["scaleMode"];
    }
  | {
      // create new image (data) from src url and use it by its hash
      type: "src";
      src: string;
      scaleMode?: ImagePaint["scaleMode"];
    };

export type ImageInsertableNode =
  | RectangleNode
  | EllipseNode
  | PolygonNode
  | StarNode
  | VectorNode
  | LineNode
  | TextNode
  | FrameNode
  | ComponentNode
  | InstanceNode
  | BooleanOperationNode;

export async function insertImageFill<T extends ImageInsertableNode>(
  node: ImageInsertableNode,
  { scaleMode = "FILL", ...p }: ImageReplacement
): Promise<T> {
  let imagefill: ImagePaint;
  switch (p.type) {
    case "hash": {
      imagefill = <ImagePaint>{
        type: "IMAGE",
        imageHash: p.hash,
        scaleMode: scaleMode,
      };
      break;
    }
    case "src": {
      const image = await figma.createImageAsync(p.src);
      imagefill = <ImagePaint>{
        type: "IMAGE",
        imageHash: image.hash,
        scaleMode: scaleMode,
      };
      break;
    }
  }

  if (imagefill) {
    if (node.fills == figma.mixed) {
      node.fills = [imagefill];
    } else {
      node.fills = [
        ...node.fills,
        // last is on the top of the stack
        imagefill,
      ];
    }
  }

  return node as T;
}
