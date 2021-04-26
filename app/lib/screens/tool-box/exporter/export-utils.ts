export function downloadFile(content) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `export-node.json`;
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
