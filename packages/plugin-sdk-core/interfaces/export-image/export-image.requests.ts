import {
  ImageExportOptions,
  QuickImageExportPreset,
  _ImageExportOption_to_FigmaCompat,
} from "./export-image.types";

export interface ImageExportRequest {
  id: string;
  opt: ImageExportOptions | QuickImageExportPreset;
}
