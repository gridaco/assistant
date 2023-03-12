import { ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE } from "@core/constant";
import { MetaDataMockDataProvider } from "../mock";
import { TargetPlatform, target_platform } from "@plugin-sdk/core";
import { PluginSdk } from "@plugin-sdk/app";
import { plugin as figma } from "@design-sdk/figma";
export class MetaDataRepositoryFactory {
  static layer(layer: string) {
    throw "not implemented";
  }
  static component(component: string): MetaDataRepository {
    return new ComponentMetaDataRepository(component);
  }
  static instance(component: string) {
    throw "not implemented";
  }
}

export abstract class MetaDataRepository<T = any> {
  constructor(readonly id: string) {}

  abstract key: string;

  async fetch(): Promise<T> {
    switch (target_platform.get()) {
      case TargetPlatform.figma:
        return await PluginSdk.fetchMetadata({
          type: "node-meta-fetch-request",
          id: this.id,
          namespace: ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE,
          key: this.key,
        });

      case TargetPlatform.webdev:
        return MetaDataMockDataProvider.componentData() as any;
    }
  }

  async update(data: T) {
    switch (target_platform.get()) {
      //  TODO -- figma api call does not work here.
      case TargetPlatform.figma:
        return await PluginSdk.updateMetadata({
          type: "node-meta-update-request",
          id: this.id,
          namespace: ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE,
          key: this.key,
          value: data,
        });
        return data;
      case TargetPlatform.webdev:
        return data;
    }
  }

  clear() {
    switch (target_platform.get()) {
      case TargetPlatform.figma:
        const data = figma
          .getNodeById(this.id)
          .setSharedPluginData(
            ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE,
            this.key,
            undefined
          );
        return;
      case TargetPlatform.webdev:
        console.log("data cleared (mocked)");
        return;
    }
  }
}

export class ComponentMetaDataRepository extends MetaDataRepository {
  constructor(readonly componentId: string) {
    super(componentId);
  }

  get key(): string {
    return "component-meta-data";
  }
}
