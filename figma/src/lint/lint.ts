import { lintMissingConstraints } from "@reflect.bridged.xyz/linter/lib/structure/constraints.lint";
import lintNamingConventions from "@reflect.bridged.xyz/linter/lib/naming"
import { detectIfIcon } from "@reflect.bridged.xyz/detection/lib/icon.detection"
import { detectIfScreen } from "@reflect.bridged.xyz/detection/lib/screen.detection";
import { ReflectLintFeedback } from "@reflect.bridged.xyz/linter/lib/feedbacks";
export function runLints(node: SceneNode) {
    // reject if selected node is too big for it's size or child count.
    if (node.width > 3000) {
        throw 'node too big for processing.'
    }

    const feedbacks: Array<ReflectLintFeedback> = []

    const constraintsWarnings = lintMissingConstraints(node)
    feedbacks.push(...(constraintsWarnings as Array<ReflectLintFeedback>))

    const namingFeedbacks = lintNamingConventions(node.name)
    feedbacks.push(...(namingFeedbacks as Array<ReflectLintFeedback>))

    // test
    // detection 
    const iconDetect = detectIfIcon(node)
    console.warn(iconDetect)

    const screenDetect = detectIfScreen(node)
    console.warn(screenDetect)
    // test

    return feedbacks
}