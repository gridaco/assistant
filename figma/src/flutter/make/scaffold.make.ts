import { Scaffold, SingleChildScrollView, Widget } from "@bridged.xyz/flutter-builder/lib";

export function makeScreen(child: Widget, scrollable?: boolean): Scaffold {
    let wrapped: Widget
    if (scrollable) {
        wrapped = new SingleChildScrollView(
            {
                child: child
            }
        )
    } else {
        wrapped = child
    }

    return new Scaffold({
        body: wrapped
    });
}