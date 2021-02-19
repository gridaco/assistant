import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { DefaultSeectionLintRunner } from "@reflect.bridged.xyz/linter/lib/linter";

export function runLints(node: ReflectSceneNode) {
  const linter = new DefaultSeectionLintRunner(node);

  const feedbacks = linter.runLints();
  return feedbacks;
}
