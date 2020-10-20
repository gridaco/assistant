import { DetectionResult } from "..";
import { checkIfRoot } from "../rules/processors/root.check";
import { checkIfValidSize } from "../rules/processors/size.check";
import rule from "./screen.rule"

export function detectIfScreen(node: SceneNode): DetectionResult {

    const isRootFrame = checkIfRoot(node)
    const isValidSize = checkIfValidSize(node, rule)

    const isScreen = isRootFrame && isValidSize

    return <DetectionResult>{
        result: isScreen,
        entity: "Screen",
        accuracy: 0.5
    }
}