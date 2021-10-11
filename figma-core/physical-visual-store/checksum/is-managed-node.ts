/**
 * to keep data container node's name clean, we add the checksum container under it as a text's content.
 * @param node
 * @returns
 */
export function isManagedNodeByAssistant(node: BaseNode) {
  const jwt = checksum_container_name_inline_jwt(node.id);
  const regex = checksum_container_regex(jwt);
  if ("children" in node) {
    const checksum = node.findChildren(
      (c) => c.type === "TEXT" && RegExp(regex).test(c.characters)
    );
    if (!checksum || checksum.length === 0) {
      return false;
    }
  } else {
    // node itself is a checksum container. this can only exist directly under page node.
    return RegExp(regex).test(node.name);
  }
  return true;
}

function checksum_container_name_inline_jwt(parent: string): string {
  // build checksum based on parent's id.
  return "--"; // TODO:
}

const checksum_container_regex = (jwt) => `/${jwt}/g`;
