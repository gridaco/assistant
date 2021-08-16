const { editDocument } = require("application");
const os = require("os");
const xd = require("scenegraph");
import ReactDOM from "react-dom";
import React from "react";

class Notifier {
  f;
  listen(f) {
    this.f = f;
  }
  notify(o) {
    this.f && this.f(o);
  }
}

let panelHolder,
  notifier = new Notifier();

function create() {
  if (panelHolder == null) {
    panelHolder = document.createElement("div");
    update();
  }
  return panelHolder;
}

function show(event) {
  if (!panelHolder) event.node.appendChild(create());
}

function update(selection?) {
  let items = selection && selection.items;
  ReactDOM.render(<h1>replace content here</h1>, panelHolder);
  // render(< key='panel' selected={items} notifier={notifier} />, );
}

module.exports = {
  panels: {
    flutterPanel: {
      show,
      update,
    },
  },
  commands: {
    // exportAll,
    // exportSelected,
  },
};
