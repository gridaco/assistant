import { SelectionType } from "plugin-app";
import Pusher, { Channel } from "pusher-js";

const _base_url =
  "https://ahzdf5x4q3.execute-api.us-west-1.amazonaws.com/production";
// https://assistant-live-session.grida.cc

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
      authEndpoint: _base_url + "/pusher/auth",
    });
  }

  get entered(): boolean {
    return this._entered;
  }

  private _entered: boolean = false;

  enter() {
    const cname = channelname(this.uid);
    this.channel = this.pusher.subscribe(cname);
    this.channel.bind("pusher:subscription_succeeded", () => {
      // now able to send client origin events
      this._entered = true;
      this._onEnter?.();
    });

    this.channel.bind("pusher:subscription_error", () => {
      this._entered = false;
    });
  }

  private _onEnter: (() => void) | null = null;
  onEnter(cb: () => void) {
    this._onEnter = cb;
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
