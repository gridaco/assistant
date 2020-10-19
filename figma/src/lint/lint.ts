import { lintMissingConstraints } from "@reflect.bridged.xyz/linter/lib/structure/constraints.lint";

export function runLints(node: SceneNode) {
    lintMissingConstraints(node)
}