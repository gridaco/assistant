import { useEffect, useState } from "react";
import { ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE } from "../../constants";
import { PluginSdk } from "../plugin-provider/plugin-app-sdk";

export function useMeta() {}

export interface VisualComponentManifest {
  name: string;
  description: string;
  storybook: string;
  docsUrl: string;
  gitUrl: string;
  codeSnippet: string;
}

export function useMainComponentMeta(
  id?: string
): VisualComponentManifest | null {
  if (!id) {
    return;
  }

  const [data, setData] = useState(null);
  useEffect(() => {
    PluginSdk.fetchMainComponentMetadata({
      id: id,
      namespace: ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE,
      key: "component-meta-data",
    }).then((d) => {
      setData(d);
    });
  });

  return data;
}
