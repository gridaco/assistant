import { NamingRule } from "../rule.base";
import minimatch from "minimatch"

/**
 * validates the givven @param name by provided glob pattern or regex in givven @param rule
 * @param name 
 * @param rule 
 */
export function checkIfValidName(name: string, rule: NamingRule): boolean {
    // return true by default if no allowed naming convention rule provided.
    if (rule.allowedNamePatterns === undefined) {
        return true
    }

    for (const pattern in rule.allowedNamePatterns) {
        // pattern
        const matched = minimatch(name, pattern)
        if (matched) {
            return true;
        }
    }

    return false
}