import { Scaffold, SingleChildScrollView, Widget } from "@bridged.xyz/flutter-builder";

export function makeScreen(child: Widget): Scaffold {
    return new Scaffold({
        body: new SingleChildScrollView(
            {
                child: child
            }
        )
    });
}