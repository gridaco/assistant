/**
 * Detection rule is used for pre-processing filtering the input node is valid for further processing.
 */

import { ReflectSceneNodeType } from "@bridged.xyz/design-sdk/lib/nodes";

export interface TypesRule {
    allowedTypes?: Array<ReflectSceneNodeType>
}

export interface SizingRule {
    minSize?: number
    minHeight?: number
    minWidth?: number

    maxSize?: number
    maxHegith?: number
    maxWidth?: number

    mustBeSquare?: boolean
}

export interface NamingRule {
    allowedNamePatterns?: Array<string>
}

export interface SlotsRule {
    allowedTextSlotCount?: number
}

export interface StructureRule extends SlotsRule {
    allowedChildren?: Array<NodeType>
    mustBeRoot?: boolean
}

export interface DetectionRule extends SizingRule, NamingRule, StructureRule, TypesRule {

}