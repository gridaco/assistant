import type {
  ReflectLintFeedback,
  ReflectLintFeedbackLevel,
} from "@reflect-ui/lint/lib/feedbacks";
import _ from "lodash";
import { fromApp } from "../__plugin/events";

/**
 * this should be called following below conditions.
 * 1. ensure single node is selected.
 *
 * otherwise, it will not respond.
 * currently it pushes event to code thread without dedicated callback linked to this function. receiving callback shall be handled on view sie with on message.
 */
export function requestLintOnCurrentSelection() {
  fromApp({
    type: "lint-request",
  });
}

export function makeSummary(lints: ReadonlyArray<ReflectLintFeedback>): {
  layers: number;
  errors: number;
  warnings: number;
} {
  const _chain = _.chain(lints);
  const _grouped = _chain
    // Group the elements of Array based on `color` property
    .groupBy("level")
    .value();

  const _e_count = _grouped[<ReflectLintFeedbackLevel>"error"]?.length ?? 0;
  const _w_count = _grouped[<ReflectLintFeedbackLevel>"warning"]?.length ?? 0;
  const _l_count = Object.keys(_.countBy(lints, "node.id"))?.length ?? 0;

  return {
    errors: _e_count,
    warnings: _w_count,
    layers: _l_count,
  };
}
