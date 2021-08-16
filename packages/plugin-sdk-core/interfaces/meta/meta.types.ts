export enum BatchMetaOperationTargetType {
  root = "document.root",
  all = "nodes.all",
  components = "nodes.components",
  // not supported yet.
  // uncomment this and implement each cases when first, batch component meta editing PR is merged.
  // origin author - @softmarshmallow
  // ---------
  // custom = 'custom',
  // instances = 'nodes.instances',
  // variants = 'nodes.variants'
  // ---------
}
export const SupportedBatchMetaOperationTargetTypes = [
  BatchMetaOperationTargetType.root,
];
