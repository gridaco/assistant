import { finalize_temporary_assets_with_prefixed_static_string_keys__dangerously } from "@code-features/assets";
import { k } from "@web-builder/core";
import * as repo_assets from "@design-sdk/asset-repository";

export function inject_assets_source_to_vanilla(
  rawsrc: string,
  repo?: repo_assets.TransportableImageRepository
) {
  repo = repo || repo_assets.ImageHostingRepository.imageRepostory;
  if (!rawsrc || !repo) {
    return rawsrc;
  }

  const images = repo.images;
  const default_asset_replacement_prefix = "grida://assets-reservation/images/";
  const data_to_blob = (d) => {
    // @ts-ignore blob
    const b = new Blob([d], { type: "image/png" });
    return URL.createObjectURL(b);
  };

  const map = Object.fromEntries(
    images.map((i) => [i.key, data_to_blob(i.data)]) ?? []
  );

  const _final =
    finalize_temporary_assets_with_prefixed_static_string_keys__dangerously(
      rawsrc,
      default_asset_replacement_prefix,
      map,
      {
        fallback: k.image_smallest_fallback_source_base_64,
      }
    );
  return _final;
}
