import { double } from "@bridged.xyz/flutter-builder/lib";
import { roundNumber } from "@reflect.bridged.xyz/uiutils/lib";

export function roundDouble(double: double): double {
    if (typeof double === "number") {
        return roundNumber(double)
    } else {
        return double
    }
}