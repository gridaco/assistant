/**
 * plugin-sdk is also used by bridged itself to support other design platform such as figma and sketch. this is only used for birdged assistant that runs on them.
 */
export const ASSISTANT_PLUGIN_NAMESPACE = "zyx.bridged.assistant";

/**
 * just in case we provide the default namespace for your custom plugin
 */
export const CUSTOM_PLUGIN_WILDCARD_NAMESPACE = "zyx.bridged.*";

/**
 * the namespace can only contain alphabetical characters, '.' and '_'.
 * other characters such as '-', '/' are not allowed. this is because figma's setSharedPluginData does not allow this.
 */
export const NS_FILE_ROOT_METADATA =
  "xyz.bridged.assistant.file_root_metadata_v1";
