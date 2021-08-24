export interface ImageExportOptions {
  format: "png" | "jpeg" | "webp" | "pdf" | "svg";
  contentsOnly: boolean;
  constraint?: {
    type: "height" | "width" | "scale";
    value: number;
  };
}

export function _ImageExportOption_to_FigmaCompat(
  data: ImageExportOptions
): _FigmaExportSettingsImage {
  const _format_map = {
    png: "PNG",
    jpeg: "JPEG",
  };

  const _constraint_type_map = {
    height: "HEIGHT",
    width: "WIDTH",
    scale: "SCALE",
  };

  return {
    format: _format_map[data.format],
    contentsOnly: data.contentsOnly,
    constraint: data.constraint
      ? <_FigmaExportSettingsConstraints>{
          // @ts-ignore
          type: _constraint_type_map[data.constraint?.type],
          value: data.constraint?.value,
        }
      : undefined,
  };
}

interface _FigmaExportSettingsImage {
  readonly format: "JPG" | "PNG";
  readonly contentsOnly?: boolean; // defaults to true
  readonly useAbsoluteBounds?: boolean; // defaults to false
  readonly suffix?: string;
  readonly constraint?: _FigmaExportSettingsConstraints;
}

interface _FigmaExportSettingsConstraints {
  readonly type: "SCALE" | "WIDTH" | "HEIGHT";
  readonly value: number;
}
