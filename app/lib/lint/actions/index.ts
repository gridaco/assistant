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
