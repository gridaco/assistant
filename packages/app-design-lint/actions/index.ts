import {
  ReflectLintFeedback,
  ReflectLintFeedbackLevel,
} from "@reflect-ui/lint/lib/feedbacks";
import _ from "lodash";
import { LintRequest, fromApp } from "../__plugin/events";
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
  try {
    const _chain = _.chain(lints);
    const _grouped = _chain
      // Group the elements of Array based on `color` property
      .groupBy("level");

    const _e_count = _grouped[<ReflectLintFeedbackLevel>"error"].length;
    const _w_count = _grouped[<ReflectLintFeedbackLevel>"warning"].length;
    const _l_count = Object.keys(_.countBy(lints, "node.id")).length;

    return {
      errors: _e_count,
      warnings: _w_count,
      layers: _l_count,
    };
  } catch (e) {
    return {
      layers: 0,
      errors: 0,
      warnings: 0,
    };
  }
}
