import { EK_APPLY_IMAGE } from "@core/constant";
import {
  renderImage,
  insertImageFill,
  ImageInsertableNode,
} from "../reflect-render/image.render";
import { addEventHandler } from "../code-thread";

interface ApplyImageProps {
  type: "auto"; // automaticly create or update iamge (if valid selection)
  src: string;
  config: {
    name?: string;
    width?: number;
    height?: number;
  };
}

async function applyImage(
  data: ApplyImageProps,
  zoom: boolean = false,
  focus: boolean = true
) {
  console.log("creating image with data", data);

  const { src, config } = data;

  const selections = figma.currentPage.selection;
  const applicapables = selections.filter(
    (s) => "fills" in s && s.fills !== figma.mixed
  ) as ReadonlyArray<ImageInsertableNode>;

  let inserted: SceneNode;
  if (applicapables.length > 0) {
    await Promise.all(
      applicapables.map((s) =>
        insertImageFill(s, {
          type: "src",
          src,
        })
      )
    );
  } else {
    inserted = await renderImage({
      name: config.name,
      width: config.width,
      height: config.height,
      src,
    });

    if (inserted) {
      if (zoom) {
        figma.viewport.scrollAndZoomIntoView([inserted]);
      }
      if (focus) {
        figma.currentPage.selection = [inserted];
      }
    }
  }
}

export function __register__() {
  addEventHandler<ApplyImageProps>(EK_APPLY_IMAGE, (msg) => {
    applyImage(msg.data);
  });
}
