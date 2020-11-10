import { Icon, Icons } from "@bridged.xyz/flutter-builder/lib"

/**
 * builds icon widget if value is hold by flutter built-in material icons
 * @param iconName 
 */
export function makeMaterialIcon(iconName: string): Icon {
    try {
        return new Icon(Icons.fromName(iconName))
    } catch (e) {
        return undefined
    }
}