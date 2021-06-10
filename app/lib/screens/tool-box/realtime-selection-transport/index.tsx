import React from "react";
import Pusher from "pusher-js";

const PUSHER_CREDS = {
  appKey: process.env.PUSHER_KEY,
  cluster: process.env.PUSHER_CLUSTER,
};

export function RealtimeSelectionTransportScreen() {
  return <></>;
}

class PusherRealtimeTransportClient {
  readonly pusher: Pusher;

  static channel = "";

  constructor() {
    this.pusher = new Pusher(PUSHER_CREDS.appKey, {
      cluster: PUSHER_CREDS.cluster,
    });
  }

  connect() {
    var channel = this.pusher.subscribe(PusherRealtimeTransportClient.channel);
    channel.bind("my-event", function (data) {
      alert(JSON.stringify(data));
    });
    // this.pusher.connect();
  }

  sendNodeSelection() {
    const evname = "selection";
    const selection = {};
    const c = this.pusher.channel("");

    // 1
    c.trigger(evname, selection);
    // or 2
    this.pusher.send_event(
      evname,
      selection,
      PusherRealtimeTransportClient.channel
    );
  }
}
