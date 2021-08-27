import { EK_SET_APP_MODE } from "@core/constant";
import { addEventHandler } from "./message-handler";

/**
 * [GLOBAL] current user viewing screen name
 */
export let user_interest: string;

export function userInterestUnset(): boolean {
  return user_interest === undefined;
}

export function setUserInterest(interest: string) {
  console.log(`app mode set event recieved, now setting as "${user_interest}"`);
  user_interest = interest;
}

export function __register__() {
  addEventHandler(EK_SET_APP_MODE, (msg) => {
    setUserInterest(msg.data);
  });
}
