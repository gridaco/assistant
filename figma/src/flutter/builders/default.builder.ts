import { AltGroupNode, AltTextNode } from "../../node-convert/mixin";
import {
    ReflectSceneNode,
    ReflectRectangleNode,
    AltEllipseNode,
    AltFrameNode,
} from "../../node-convert/mixin";

import { Widget } from "@bridged.xyz/flutter-builder";
import { retrieveFill } from "../../figma-utils/retrieve-fill";
import { wrapWithContainer } from "../wrappers/container.wrap";
import { wrapWithOpacity } from "../wrappers/opacity.wrap";
import { wrapWithPositioned } from "../wrappers/positioned.wrap";
import { wrapWithRotation } from "../wrappers/rotation.wrap";
import { wrapWithVisibility } from "../wrappers/visibility.wrap";

export class WidgetBuilder {
    child: Widget;
    node: ReflectRectangleNode | AltEllipseNode | AltFrameNode | AltGroupNode | AltTextNode

    constructor(args: {
        node: ReflectRectangleNode | AltEllipseNode | AltFrameNode | AltGroupNode | AltTextNode
        child?: Widget
    }) {
        this.child = args.child
        this.node = args.node;
    }

    wrapWithContainer(): this {
        // do not wrap if, "text"
        if (this.node instanceof AltTextNode) {
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
