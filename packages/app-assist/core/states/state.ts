import { Framework } from "@grida/builder-platform-types";
import type { Message, ResponseMessage } from "core/types";

export const SUBJECT_NON_SET = Symbol("subject-non-set");

/**
 * A chat session state.
 */
export interface State {
  /**
   * The chat session ID.
   */
  id: string;

  /**
   * The chat session subject.
   */
  subject: string | typeof SUBJECT_NON_SET;

  /**
   * The chat session history.
   */
  history: Message[];

  /**
   * The incoming message.
   */
  incoming: ResponseMessage;

  /**
   * Updated at.
   */
  updatedAt: Date;
}

type CodeResponseMessage = ResponseMessage<{
  type: "gen.code";
  node: string;
  framework: Framework;
}>;

type ImageResponseMessage = ResponseMessage<{
  type: "gen.image";
  q: string;
  n: number;
}>;
