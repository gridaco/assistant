import { PluginSdk } from "@plugin-sdk/app";
import { IProperties, ISingleLayerProperty } from "../types";

/**
 * mocks a table based on k:v storage
 */
export class MappedPropertyStorage {
  readonly key: string;

  constructor(readonly of) {
    this.key = `properties-of-${this.of}`;
  }

  /**
   * upserts a property
   * @param param0
   */
  async upsertLayerProperty({
    layerId,
    name,
    accessor,
    type,
  }: {
    layerId;
    name;
    accessor;
    type;
  }) {
    const all = await this.getProperties();

    // the record is unique by (layerId + accessor)
    const existing = all.findIndex((p) => p.id === `${layerId}/${accessor}`);

    const newRecord = <ISingleLayerProperty>{
      id: `${layerId}/${accessor}`,
      layer: layerId,
      schema: {
        name: name,
        type: type,
      },
      targetProperty: accessor,
    };

    if (existing !== -1) {
      all[existing] = newRecord;
      await this.updateProperties(...all);
    } else {
      await this.updateProperties(...all, newRecord);
    }
    return newRecord;
  }

  async getPropertiesOf(layer: string) {
    return (await this.getProperties()).filter((p) => p.layer.id === layer);
  }

  private __properties__cache: IProperties;
  async getProperties(): Promise<IProperties> {
    if (!this.__properties__cache) {
      this.__properties__cache = await PluginSdk.getItem(this.key);
    }
    return this.__properties__cache ?? [];
  }

  private async updateProperties(...all: IProperties) {
    this.__properties__cache = all;
    await PluginSdk.setItem(this.key, all);
  }

  async sync(all: IProperties) {
    this.updateProperties(...all);
  }
}

//// archive --- legacy way, list all meta data under master's children. access all.
//2. extract schema from layers

//  Promise.all(
//    grandchilds.map((c) => {
//      return PluginSdk.fetchMetadata_grida<ISingleLayerProperty>(
//        c.id,
//        "layer-property-data"
//      );
//    })
//  ).then((res) => {
//    const layersWithPropertyData = res.filter((i) => i !== undefined);
//    setProperties(layersWithPropertyData);
//  });
