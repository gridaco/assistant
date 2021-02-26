import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { ReflectLintFeedback } from "@reflect.bridged.xyz/linter/lib/feedbacks/feedback";
import { DefaultSeectionLintRunner } from "@reflect.bridged.xyz/linter/lib/linter";

export function runLints(
  node: ReflectSceneNode
): ReadonlyArray<ReflectLintFeedback> {
  const linter = new DefaultSeectionLintRunner(node);

  const feedbacks = linter.runLints();
  return feedbacks;
}
