import { Container, Widget } from "@bridged.xyz/flutter-builder/lib";

export function makeSaflyAsSingle(maybeWidget: Array<Widget> | Widget): Widget {
    if (Array.isArray(maybeWidget)) {
        return new Container()
    } else {
        if (maybeWidget instanceof Widget) {
            return maybeWidget
        }
    }
    return new Container()
}