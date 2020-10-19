import { lintMissingConstraints } from "@reflect.bridged.xyz/linter/lib/structure/constraints.lint";
import lintNamingConventions from "@reflect.bridged.xyz/linter/lib/naming"
export function runLints(node: SceneNode) {
    lintMissingConstraints(node)
    const namingFeedbacks = lintNamingConventions(node.name)
}