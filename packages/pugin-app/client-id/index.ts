import { client_id_store } from "./store";
import { nanoid } from "nanoid/non-secure";

function makeid(): string {
  return `cid-${nanoid()}`;
}

function initially_register_this_client_to_storage() {
  const _id = makeid();
  client_id_store.set(_id);
  client_id = _id;
}

/**
 * readonly for api usage. writing only accessible via `__set_client_id`
 * this is always ensured to be non-null and available by view access after plugin app is initialized.
 **/
export let client_id: string;

export async function initialize() {
  const _existing_in_store = await client_id_store.get();
  if (!_existing_in_store) {
    initially_register_this_client_to_storage();
  } else {
    client_id = _existing_in_store;
  }
  return client_id;
}
