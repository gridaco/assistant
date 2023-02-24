import { EK_CREATE_IMAGE } from "@core/constant";
import { renderImage } from "../reflect-render/image.render";
import { addEventHandler } from "../code-thread";

interface CreateImageProps {
  src: string;
  config: {
    name?: string;
    width?: number;
    height?: number;
  };
}

async function createImage(
  data: CreateImageProps,
  zoom: boolean = true,
  focus: boolean = true
) {
  console.log("creating image with data", data);

  const { src, config } = data;

  const inserted = await renderImage({
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

export function __register__() {
  addEventHandler<CreateImageProps>(EK_CREATE_IMAGE, (msg) => {
    createImage(msg.data);
  });
}
