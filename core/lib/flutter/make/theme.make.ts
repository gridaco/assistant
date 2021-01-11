import { ThemeData } from "@bridged.xyz/flutter-builder/lib";
import { makeTextTheme } from "./text-theme.make";

export function makeTheme(): ThemeData {
    return new ThemeData({
        textTheme: makeTextTheme()
    })
}