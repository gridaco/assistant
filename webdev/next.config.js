const path = require("path");

const withTM = require("next-transpile-modules")(
    // All of the packages will resolve to our monorepo so we can match that path.
    [
        path.resolve(__dirname, "../ui"),
    ]
);

module.exports = withTM();
