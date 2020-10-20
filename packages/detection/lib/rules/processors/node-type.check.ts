import { TypesRule } from "../rule.base";

/**
 * check if node is a valid type for the target rule.
 * simply iterate through existsing node types, if matches, return true.
 * if no rule provided, return true by default.
 * @param node 
 * @param rule 
 */
export function checkIfValidNodeType(node: SceneNode, rule: TypesRule): boolean {
    if (rule.allowedTypes) {
        return rule.allowedTypes.includes(node.type)
    }
    return true
}