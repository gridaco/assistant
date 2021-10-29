import * as serverlessExpress from "aws-serverless-express";
import { APIGatewayProxyHandler } from "aws-lambda";

import app from "./app";

const binaryMimeTypes = [
  "*/*",
  // "text/css",
  // "text/html",
  // "text/javascript",
  // "text/plain",
  // "text/text",
  // "text/xml",
  // "application/javascript",
  // "application/json",
  // "application/xml",
  // https://github.com/vendia/serverless-express/blob/master/examples/basic-starter/lambda.js
];

const server = serverlessExpress.createServer(app, null, binaryMimeTypes);

export const handler: APIGatewayProxyHandler = (event, context) => {
  serverlessExpress.proxy(server, event, context);
};
