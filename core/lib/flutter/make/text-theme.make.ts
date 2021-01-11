import { TextStyleRepository, TextThemeStyles } from "@bridged.xyz/design-sdk/lib/figma";
import { TextTheme, TextStyle } from "@bridged.xyz/flutter-builder/lib";
import { makeTextStyleFromDesign } from "./text-style.make";

export function makeTextTheme(): TextTheme {
    function buildTextStyle(style: TextThemeStyles): TextStyle {
        try {
            return makeTextStyleFromDesign(TextStyleRepository.getDefaultDesignTextStyleFromRegistry(style))
        } catch (e) {
            // console.warn('failed to build textstyle. err:', e)
        }
    }

    return new TextTheme({
        headline1: buildTextStyle(TextThemeStyles.headline1),
        headline2: buildTextStyle(TextThemeStyles.headline2),
        headline3: buildTextStyle(TextThemeStyles.headline3),
        headline4: buildTextStyle(TextThemeStyles.headline4),
        headline5: buildTextStyle(TextThemeStyles.headline5),
        headline6: buildTextStyle(TextThemeStyles.headline6),
        subtitle1: buildTextStyle(TextThemeStyles.subtitle1),
        subtitle2: buildTextStyle(TextThemeStyles.subtitle2),
        bodyText1: buildTextStyle(TextThemeStyles.bodyText1),
        bodyText2: buildTextStyle(TextThemeStyles.bodyText2),
        button: buildTextStyle(TextThemeStyles.button),
        caption: buildTextStyle(TextThemeStyles.caption),
        overline: buildTextStyle(TextThemeStyles.overline)
    })
}