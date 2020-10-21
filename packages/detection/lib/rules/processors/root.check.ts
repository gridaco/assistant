import { checkIfRoot as check } from "@bridged.xyz/design-sdk/lib/utils/check-if-root"

export function checkIfRoot(node: SceneNode) {
    return check(node)
}