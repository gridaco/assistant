import { DetectionRule } from "../rules/rule.base";

export default <DetectionRule>{
    allowedTypes: ["LINE", "RECTANGLE", "COMPONENT", "INSTANCE"],

    maxHegith: 4,
    minHeight: 0,
    minWidth: 248,
    maxWidth: 1080,
}