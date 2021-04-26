import { ASSISTANT_PLUGIN_NAMESPACE } from "../../constants";
import { MetaDataMockDataProvider } from "../../mock";
import {
  TargetPlatform,
  TARGET_PLATFORM,
} from "../../utils/plugin-init/init-target-platform";
import { PluginSdk } from "../../utils/plugin-provider/plugin-app-sdk";

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
    switch (TARGET_PLATFORM) {
      case TargetPlatform.figma:
        return await PluginSdk.fetchMetadata({
          id: this.id,
          namespace: ASSISTANT_PLUGIN_NAMESPACE,
          key: this.key,
        });

      case TargetPlatform.webdev:
        return MetaDataMockDataProvider.componentData() as any;
    }
  }

  async update(data: T) {
    switch (TARGET_PLATFORM) {
      //  TODO -- figma api call does not work here.
      case TargetPlatform.figma:
        return await PluginSdk.updateMetadata({
          id: this.id,
          namespace: ASSISTANT_PLUGIN_NAMESPACE,
          key: this.key,
          value: data,
        });
        return data;
      case TargetPlatform.webdev:
        console.log("data updated (mocked)");
        return data;
    }
  }

  clear() {
    switch (TARGET_PLATFORM) {
      case TargetPlatform.figma:
        const data = figma
          .getNodeById(this.id)
          .setSharedPluginData(ASSISTANT_PLUGIN_NAMESPACE, this.key, undefined);
      case TargetPlatform.webdev:
        console.log("data cleared (mocked)");
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
