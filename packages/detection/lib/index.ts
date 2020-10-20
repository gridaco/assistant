export interface DetectionResult {
    result: boolean
    entity: Entity
    accuracy: number
    reason?: Array<string>
}


export type Entity = "Graphics" | "Icon" | "Unknown" | "Button" | "Screen"