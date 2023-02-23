import {
  ImageExportOptions,
  QuickImageExportPreset,
} from "./export-image.types";

export interface ImageExportResponse {
  id: string;
  data: Uint8Array;
  opt: ImageExportOptions | QuickImageExportPreset;
}
