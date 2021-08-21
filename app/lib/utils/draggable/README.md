## Drag and Drop implementation on figma platform

> The original code is from https://github.com/jackiecorn/figma-plugin-drag-and-drop

This feature is deprecated.

### Reason

- Drag and Drop does not work in iframe within iframe

### Solution

- Disable iframe on pages use drag and drop
- Overlap dragable component on original iframe
- Do not use iframe within iframe
- Wait for the Figma api update to receive the position of the plugin window

### Issue

https://github.com/gridaco/assistant/issues/136
