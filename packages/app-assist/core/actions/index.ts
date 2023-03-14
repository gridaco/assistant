export type Action = UserMessageAction;

export interface UserMessageAction {
  type: "user-message";
  content: string;
}

export const userMessage = (content: string): UserMessageAction => ({
  type: "user-message",
  content,
});
