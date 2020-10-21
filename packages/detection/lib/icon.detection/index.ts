import rule from "./icon.rules"
import { DetectionResult } from "..";
import { checkIfSquare } from "../rules/processors/square.check";
import { checkIfValidSize } from "../rules/processors/size.check";
import { checkIfValidName } from "../rules/processors/name.check";
export function detectIfIcon(node: SceneNode): DetectionResult {
    const name = node.name;
    const isNameValid = checkIfValidName(name, rule)
    if (isNameValid) {
        return {
            result: true,
            entity: "Icon",
            accuracy: 1
        }
    }

    const isValidSize = checkIfValidSize(node, rule)
    const isSquare = checkIfSquare(node)
    const isIcon = isValidSize && isSquare
    return {
        result: isIcon,
        entity: isIcon ? "Icon" : "Unknown",
        accuracy: 0.1
    }
}
