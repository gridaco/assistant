import * as serverlessExpress from "aws-serverless-express";
import { APIGatewayProxyHandler } from "aws-lambda";

import app from "./app";

const binaryMimeTypes = [
  "application/javascript",
  "application/json",
  "application/octet-stream",
  "application/xml",
  "font/eot",
  "font/opentype",
  "font/otf",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "text/comma-separated-values",
  "text/css",
  "text/html",
  "text/javascript",
  "text/plain",
  "text/text",
  "text/xml",
  // https://github.com/vendia/serverless-express/blob/master/examples/basic-starter/lambda.js
];

const server = serverlessExpress.createServer(app, null, binaryMimeTypes);

export const handler: APIGatewayProxyHandler = (event, context) => {
  serverlessExpress.proxy(server, event, context);
};
