import { SelectionType } from "plugin-app";
import Pusher, { Channel } from "pusher-js";

export class AssistantLiveSession {
  private readonly pusher: Pusher;
  private channel: Channel;
  private readonly uid: string;
  private readonly filekey: string;

  constructor({ uid, filekey }: { uid: string; filekey: string }) {
    this.uid = uid;
    this.filekey = filekey;

    this.pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      // authEndpoint:
      // "https://ahzdf5x4q3.execute-api.us-west-1.amazonaws.com/production/pusher/auth",
      // authEndpoint: "http://localhost:33031/dev/pusher/auth",
      authEndpoint: "https://assistant-live-session.grida.cc/pusher/auth",
    });
  }

  get entered(): boolean {
    return Boolean(this.channel);
  }

  enter() {
    const cname = channelname(this.uid);
    this.channel = this.pusher.subscribe(cname);
    this.channel.bind("pusher:subscription_succeeded", () => {
      // now able to send client origin events
      console.info("subscription succeeded");
    });
  }

  emmitSelect(selesction: SelectionPayload) {
    this.channel.trigger("client-select", selesction);
  }
}

function channelname(uid: string): string {
  return "private-live-session"; //+ uid;
}

interface SelectionPayload {
  event: "select";
  selectionType: SelectionType;
  filekey: string;
  node?: string;
}
