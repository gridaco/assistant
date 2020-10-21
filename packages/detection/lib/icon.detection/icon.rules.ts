import { DetectionRule } from "../rules/rule.base"
import { DEFAULT_ICON_NAMING_CONVENTION_PATTERNS } from "@reflect.bridged.xyz/linter/lib/constants/naming-conventions/icon.naming"

export default <DetectionRule>{
    minSize: 12,
    maxSize: 80,
    mustBeSquare: true,
    allowedNamePatterns: DEFAULT_ICON_NAMING_CONVENTION_PATTERNS
}