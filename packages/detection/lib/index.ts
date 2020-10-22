import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes"
import { detectIfIcon } from "./icon.detection"
import { detectIfScreen } from "./screen.detection"

export interface DetectionResult {
    result: boolean
    entity: Entity
    accuracy: number
    reason?: Array<string>
}


export type Entity = "Graphics" | "Icon" | "Unknown" | "Button" | "Screen"

export function detect(node: ReflectSceneNode) {
    // detection 
    // FIXME "as any"
    const iconDetect = detectIfIcon(node as any)
    console.warn(iconDetect)

    // FIXME "as any"
    const screenDetect = detectIfScreen(node as any)
    console.warn(screenDetect)
}