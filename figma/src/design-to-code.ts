import type { ReflectSceneNode } from "@design-sdk/core/nodes";
import { flutter } from "@designto/code";
import * as react from "@designto/react";
import { tokenize } from "@designto/token";

type InterceptorJobProcessor = () => Promise<void>;
export async function designToFlutter(
  reflectDesign: ReflectSceneNode,
  jobs: InterceptorJobProcessor
) {
  const buildResult = flutter.buildApp(reflectDesign);

  // execution order matters.
  // this will be fixed by having a builder instance. (currently non available)
  await jobs();

  const widget = buildResult.widget;
  const app = flutter.makeApp({
    widget: widget,
    scrollable: buildResult.scrollable,
  });

  return {
    widget,
    app,
  };
}

export function designToReact(reflectDesign: ReflectSceneNode) {
  const tokens = tokenize(reflectDesign);
  const widget = react.buildReactWidget(tokens);
  const app = react.buildReactApp(widget, {
    template: "cra",
  });

  return {
    tokens: tokens,
    widget: widget,
    app: app,
  };
}

export function designToCode() {
  throw "not implemented";
}
