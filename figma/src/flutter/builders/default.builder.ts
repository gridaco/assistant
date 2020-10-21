import {
    ReflectSceneNode,
    ReflectRectangleNode,
    ReflectEllipseNode,
    ReflectFrameNode, ReflectGroupNode, ReflectTextNode
} from "@bridged.xyz/design-sdk/lib/nodes/mixin";

import { Widget } from "@bridged.xyz/flutter-builder";
import { retrieveFill } from "../../figma-utils/retrieve-fill";
import { wrapWithContainer } from "../wrappers/container.wrap";
import { wrapWithOpacity } from "../wrappers/opacity.wrap";
import { wrapWithPositioned } from "../wrappers/positioned.wrap";
import { wrapWithRotation } from "../wrappers/rotation.wrap";
import { wrapWithVisibility } from "../wrappers/visibility.wrap";

export class WidgetBuilder {
    child: Widget;
    node: ReflectRectangleNode | ReflectEllipseNode | ReflectFrameNode | ReflectGroupNode | ReflectTextNode

    constructor(args: {
        node: ReflectRectangleNode | ReflectEllipseNode | ReflectFrameNode | ReflectGroupNode | ReflectTextNode
        child?: Widget
    }) {
        this.child = args.child
        this.node = args.node;
    }

    wrapWithContainer(): this {
        // do not wrap if, "text"
        if (this.node instanceof ReflectTextNode) {
            return this;
        }

        // if child is in array form, don't wrap with container.
        if (!Array.isArray(this.child)) {
            this.child = wrapWithContainer(this.node, this.child);
        }
        return this;
    }

    blendWithAttributes(): this {
        this.child = wrapWithVisibility(this.node, this.child);
        this.child = wrapWithRotation(this.node, this.child);
        this.child = wrapWithOpacity(this.node, this.child);

        return this;
    }

    positionInParent(parentId: string): this {
        this.child = wrapWithPositioned(this.node, this.child, parentId);
        return this;
    }
}
