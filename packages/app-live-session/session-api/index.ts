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
    this.channel.bind_global((e) => {
      console.log("e", e);
    });
    this.channel.bind("client-select", () => {
      console.log("channel bind ev recvd");
    });
  }

  emmitSelect() {
    this.channel.trigger("client-select", <SelectionPayload>{
      filekey: this.filekey,
    });
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
