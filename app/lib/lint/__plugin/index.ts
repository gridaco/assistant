// onService(main_cb);

// // main callback
// function main_cb(evt: _Event_DataMapper_GoodUserInputTransfer) {
//   const datasourceNode = Figma.figma.getNodeById(
//     evt.sourceNodeId
//   ) as Figma.SceneNode;
//   const targets = evt.targetNodesId.map((id) => Figma.figma.getNodeById(id));
//   const data = extractDataFromDataSourceNode(datasourceNode);

//   targets.forEach((target) => {
//     if ("children" in target) {
//       mapDataToSelection(target as Figma.SceneNode, data);
//     } else {
//       PluginSdk.notify(
//         "ignoring since one of the selection is not a type of frame or group"
//       );
//     }
//   });
// }
