// =========================================================================================================
// message handling

type FigmaMessageHandler<T = any> = (
  msg: { type: string; data: any } | any | T
) => void;
const messageHandlers: FigmaMessageHandler[] = [];

export function onfigmamessage(msg) {
  // logging
  // console.log("[event] figma plugin data received", msg);

  messageHandlers.forEach((handler) => {
    handler?.({
      ...msg,
      type: msg.type,
      data: msg.data,
    });
  });
}

export function addMessageHandler(handler: FigmaMessageHandler) {
  messageHandlers.push(handler);
}

export function addEventHandler<T = any>(
  type: string,
  handler: FigmaMessageHandler<T>
) {
  if (process.env.NODE_ENV == "development") {
    console.log("adding event handler", type);
  }

  messageHandlers.push((msg) => {
    if (msg.type == type) {
      handler?.(msg);
    }
  });
}
// =========================================================================================================
