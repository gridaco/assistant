import { ReflectSceneNodeType } from "@bridged.xyz/design-sdk/lib/nodes";
import { DetectionRule } from "../rules/rule.base";

export default <DetectionRule>{
    allowedTypes: [ReflectSceneNodeType.line, ReflectSceneNodeType.rectangle, ReflectSceneNodeType.component, ReflectSceneNodeType.instance, ReflectSceneNodeType.variant],
    maxHegith: 4,
    minHeight: 0,
    minWidth: 248,
    maxWidth: 1080,
}