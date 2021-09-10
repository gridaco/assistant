import { useEffect, useState } from "react";
import { ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE } from "@core/constant";
import { PluginSdk } from "@plugin-sdk/app";

export interface VisualComponentManifest {
  name: string;
  description: string;
  storybook: string;
  docsUrl: string;
  gitUrl: string;
  codeSnippet: string;
}

/**
 * @deprecated
 * @param id
 * @returns
 */
export function useMainComponentMeta(
  id?: string
): VisualComponentManifest | null {
  if (!id) {
    return;
  }

  const [data, setData] = useState(null);
  useEffect(() => {
    PluginSdk.fetchMainComponentMetadata({
      type: "node-meta-fetch-request",
      id: id,
      namespace: ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE,
      key: "component-meta-data",
    }).then((d) => {
      setData(d);
    });
  });

  return data;
}
