import { BasePluginEvent } from "@plugin-sdk/core";

export function request<T = any>(event: BasePluginEvent): Promise<T> {
  // make id
  const requestId = this.makeRequetsId(event.key);

  return new Promise<T>((resolve, reject) => {
    // register to event / response que
    this.registerToEventQue(requestId, resolve, reject);

    // post message after registration is complete.
    this.postMessage({
      type: "request",
      origin: "app",
      ...event,
      id: requestId,
    });
  });
}
