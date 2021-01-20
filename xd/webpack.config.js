const exec = require("child_process").exec;

let isProd = false;
let isWatch = true;
try {
  const config = JSON.parse(process.env.npm_config_argv);
  isProd = config.original.includes("--production");
  isWatch = !(config.original.includes("--no-watch") || isProd);
} catch (e) { }

module.exports = {
  entry: "./src/ui/main.tsx",
  mode: isProd ? "production" : "development",
  watch: isWatch,
  output: {
    path: __dirname + "/dist",
    filename: 'main.js',
    libraryTarget: "commonjs2"
  },
  devtool: isProd ? "none" : "source-map",
  resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },
  module: {
    rules: [
         // Converts TypeScript code to JavaScript
         { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },

         // Enables including CSS by doing "import './file.css'" in your TypeScript code
         { test: /\.css$/, loader: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },

         // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
         { test: /\.(png|jpg|gif|webp|svg|zip)$/, loader: [{ loader: 'url-loader' }] },
    ]
  },
  externals: [
    "os",
    "scenegraph",
    "application",
	  "clipboard",
	  "assets",
    "uxp",
    function (context, request, callback) {
      if (/lib/.test(request)) {
        return callback(null, request.substr(1), "commonjs2")
      }
      callback();
    }
  ],
  plugins: [
    {
      apply: (compiler) => {
        const runDeploy = () => exec("yarn deploy", (err, stdout, stderr) => {
          if (stdout) { console.log("\nWebpack bundle complete, plugin folder updated"); }
          if (stderr) { console.error(stderr); }
        });
        if (isWatch) {
          compiler.hooks.afterEmit.tap("DeployPlugin", runDeploy);
        } else {
          compiler.hooks.done.tap("DeployPlugin", runDeploy);
        }
      }
    }
  ]
};