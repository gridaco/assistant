export type Message = ResponseMessage | UserMessage;

export interface UserMessage {
  role: "user";
  content: string;
}

export type ResponseMessage = {
  role: "assistant";
  content: string;
};

export class Conversation {
  _messages: Message[];

  constructor() {
    this._messages = [];
  }

  get messages() {
    return this._messages;
  }

  addMessage(message: Message) {
    this._messages.push(message);
  }

  get lastMessage(): Message {
    return this._messages[this._messages.length - 1];
  }

  get lastResponse(): Message {
    return this._messages[this._messages.length - 2];
  }

  get lastUserMessage(): Message {
    return this._messages[this._messages.length - 3];
  }
}
