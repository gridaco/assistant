/**
 * this triggers the file download from the design tool you are interacting with
 */
export function downloadFile(content) {
  // @ts-ignore blob
  const blob = new Blob([content], { type: "text/plain" });
  // @ts-ignore blob
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `export-node.json`; // TODO: make name more flexible
  a.click();
  a.remove();
  // @ts-ignore blob
  window.URL.revokeObjectURL(url);
}
