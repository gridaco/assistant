figma.once("run", () => {
  figma
    .getNodeById(
      /**
       * root node's id is always 0:0 on plugin api. [learn more](https://github.com/figma/plugin-typings/issues/13)
       */
      "0:0"
    )
    .setRelaunchData({ open: "" });
});
