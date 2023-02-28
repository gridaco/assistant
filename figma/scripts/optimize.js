// before publishing update to figma, clean the dist forder for the size reduction.
// leave only dist/code.js and dist/ui.js under the dist folder (remove all other files)

const fs = require("fs");
const path = require("path");

const distPath = path.join(__dirname, "../dist");

fs.readdirSync(distPath).forEach((file) => {
  if (file !== "code.js" && file !== "ui.html") {
    fs.unlink(path.join(distPath, file), (err) => {
      if (err) throw err;
    });
  }
});
