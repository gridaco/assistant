/**
 * custom rand id generator for managin local mem request id
 * 1. not using nanoid - which is bridged standard, since nanoid won't work on some platform (e.g. figma)
 * 2. it doesn't have to be a sequre or complex id, since it's used locally
 * @param length
 * @returns
 */
export function reqid(length = 5) {
  const result = [];
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}
