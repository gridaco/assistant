/**
 * Detection rule is used for pre-processing filtering the input node is valid for further processing.
 */
export interface DetectionRule {
    minSize: number
    minHeight: number
    minWidth: number

    maxSize: number
    maxHegith: number
    maxWidth: number

    mustBeSquare: boolean

}