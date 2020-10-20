import { lintMissingConstraints } from "@reflect.bridged.xyz/linter/lib/structure/constraints.lint";
import lintNamingConventions from "@reflect.bridged.xyz/linter/lib/naming"
import { detectIfIcon } from "@reflect.bridged.xyz/detection/lib/icon.detection"
import { detectIfScreen } from "@reflect.bridged.xyz/detection/lib/screen.detection";
export function runLints(node: SceneNode) {
    // reject if selected node is too big for it's size or child count.
    if (node.width > 3000) {
        throw 'node too big for processing.'
    }


    const constraintsWarnings = lintMissingConstraints(node)
    console.warn(constraintsWarnings)

    const namingFeedbacks = lintNamingConventions(node.name)
    console.warn(namingFeedbacks)

    // detection 
    const iconDetect = detectIfIcon(node)
    console.warn(iconDetect)

    const screenDetect = detectIfScreen(node)
    console.warn(screenDetect)


}