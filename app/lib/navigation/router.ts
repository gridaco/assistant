import { MemoryRouter, BrowserRouter } from "react-router-dom";

export const getDedicatedRouter = () =>
  _is_in_iframe() ? MemoryRouter : BrowserRouter;

function _is_in_iframe() {
  if (process["browser"]) {
    // The page is in an iframe
    return window.location !== window.parent.location;
  }
}
