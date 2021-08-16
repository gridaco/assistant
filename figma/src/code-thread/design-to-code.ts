import type { ReflectSceneNode } from "@design-sdk/core/nodes";
import { flutter, react, token } from "@designto/code";

interface GenerationResultToUI {
  tokens?: any;
  widget: any;
  app: any;
}

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

  return <GenerationResultToUI>{
    widget: widget,
    app: app,
  };
}

export function designToReact(reflectDesign: ReflectSceneNode) {
  const tokens = token.tokenize(reflectDesign);
  const widget = react.buildReactWidget(tokens);
  const app = react.buildReactApp(widget, {
    template: "cra",
  });

  return <GenerationResultToUI>{
    tokens: tokens,
    widget: widget,
    app: app.code,
  };
}

export function designToCode() {
  throw "not implemented";
}
