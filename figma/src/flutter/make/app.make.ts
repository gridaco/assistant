import { MaterialApp, Widget } from "@bridged.xyz/flutter-builder/lib";
import { makeScreen } from "./scaffold.make";
import { makeTheme } from "./theme.make";

export function makeApp(home: {
    widget: Widget
    scrollable: boolean
}): MaterialApp {
    return new MaterialApp({
        title: 'app built with bridged.xyz',
        debugShowCheckedModeBanner: false,
        home: Widget.prebuilt(wrapWithBuilder(makeScreen(home.widget, home.scrollable).build().finalize())),
        theme: makeTheme()
    });
}

// this is required, since Theme.of(context) uses context, which wont get effected, if sharing the same root.
function wrapWithBuilder(content): string {
    return `Builder(builder: (BuildContext context){
        return ${content}
    })`
}