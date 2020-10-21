import { lintMissingConstraints } from "@reflect.bridged.xyz/linter/lib/structure.lint/constraints.lint";
import lintNamingConventions from "@reflect.bridged.xyz/linter/lib/naming.lint"
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
    if (Array.isArray(constraintsWarnings)) {
        feedbacks.push(...(constraintsWarnings))
    }

    const namingFeedbacks = lintNamingConventions(node.name)
    if (Array.isArray(namingFeedbacks)) {
        feedbacks.push(...(namingFeedbacks))
    }

    // test
    // detection 
    const iconDetect = detectIfIcon(node)
    console.warn(iconDetect)

    const screenDetect = detectIfScreen(node)
    console.warn(screenDetect)
    // test

    return feedbacks
}