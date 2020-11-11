import { ThemeData } from "@bridged.xyz/flutter-builder";
import { makeTextTheme } from "./text-theme.make";

export function makeTheme(): ThemeData {
    return new ThemeData({
        textTheme: makeTextTheme()
    })
}