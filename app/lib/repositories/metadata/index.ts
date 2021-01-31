import { ASSISTANT_PLUGIN_NAMESPACE } from "../../constants";
import { MetaDataMockDataProvider } from "../../mock";
import {
  TARGET_PLATFORM,
  TargetPlatform,
} from "@bridged.xyz/design-sdk/lib/platform";

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

  fetch(): T {
    switch (TARGET_PLATFORM) {
      case TargetPlatform.figma:
        const data = figma
          .getNodeById(this.id)
          .getSharedPluginData(ASSISTANT_PLUGIN_NAMESPACE, this.key);
        return JSON.parse(data);
      case TargetPlatform.webdev:
        return MetaDataMockDataProvider.componentData() as any;
    }
  }

  update(data: T) {
    switch (TARGET_PLATFORM) {
      //  TODO -- figma api call does not work here.
      case TargetPlatform.figma:
        figma
          .getNodeById(this.id)
          .setSharedPluginData(
            ASSISTANT_PLUGIN_NAMESPACE,
            this.key,
            JSON.stringify(data)
          );
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
