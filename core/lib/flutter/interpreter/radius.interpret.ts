import { Radius } from "@bridged.xyz/flutter-builder/lib";
import { IRadius } from "@reflect.bridged.xyz/core/lib/ui/radius/radius.manifest";

export function interpretRadius(radius: IRadius): Radius {
    if (typeof radius == 'number') {
        return Radius.circular(radius as number)
    } else {
        throw 'elliptical radius is not supported'
    }
}