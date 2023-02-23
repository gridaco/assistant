import { EK_CREATE_ICON, EK_ICON_DRAG_AND_DROPPED } from "@core/constant";
import { PluginSdkService } from "@plugin-sdk/service";
import { IconPlacement, renderSvgIcon } from "../reflect-render/icons.render";
import { addEventHandler } from "../code-thread";

interface CreateIconProps {
  key: string;
  svg: string;
  config: {
    name: string;
    size: number;
    variant?: string;
    package: string;
  };
}

function createIcon(
  data: CreateIconProps,
  placement: IconPlacement = "center",
  zoom: boolean = true,
  focus: boolean = true
) {
  console.log("creating icon with data", data);
  const icon_key = data.key;
  const svgData = data.svg;
  const inserted = renderSvgIcon(
    icon_key,
    svgData,
    "#000000",
    placement,
    data.config
  );
  if (zoom) {
    figma.viewport.scrollAndZoomIntoView([inserted]);
  }
  if (focus) {
    figma.currentPage.selection = [inserted];
  }
}

PluginSdkService.registerDragAndDropHandler(
  EK_ICON_DRAG_AND_DROPPED,
  (data, pos): Promise<any> => {
    createIcon(
      data,
      {
        x: pos.x,
        y: pos.y,
      },
      false,
      false
    );
    return;
  }
);

export function __register__() {
  addEventHandler<CreateIconProps>(EK_CREATE_ICON, (msg) => {
    createIcon(msg.data);
  });
}
