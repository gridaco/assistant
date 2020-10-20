import { lintMissingConstraints } from "@reflect.bridged.xyz/linter/lib/structure/constraints.lint";
import lintNamingConventions from "@reflect.bridged.xyz/linter/lib/naming"
export function runLints(node: SceneNode) {
    const constraintsWarnings = lintMissingConstraints(node)
    console.warn(constraintsWarnings)

    const namingFeedbacks = lintNamingConventions(node.name)
    console.warn(namingFeedbacks)
}