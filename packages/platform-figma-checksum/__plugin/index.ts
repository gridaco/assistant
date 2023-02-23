import { onService, _Checksum_Event } from "./events";
import { FigmaRootNodeStoreVerification } from "@design-sdk/figma-checksum";

onService(main_cb);

// main callback
function main_cb(evt: _Checksum_Event) {
  switch (evt.type) {
    case "seed-signature-request": {
      const verifier = new FigmaRootNodeStoreVerification({
        filekey: evt.filekey,
        signature: evt.signature,
      });
      // prewarm shall be called on code thread of figma.
      verifier.prewarm();

      // pending verfiication will be handled on ui thread with remote request.
      break;
    }
  }
}
