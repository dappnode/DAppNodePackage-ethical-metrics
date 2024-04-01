import express from "express";
import cors from "cors";
import http from "node:http";
import client from "prom-client";
import logger from "../../logger/index.js";

export function startMetricsApi({
  serverName,
  torInstance,
  port = 9090,
}: {
  serverName: string;
  torInstance: string;
  port?: number;
}): http.Server {
  const app = express();
  const server = new http.Server(app);
  app.use(cors());

  const register = new client.Registry();
  const torInstanceInfo = new client.Gauge({
    name: "tor_instance_info",
    help: "Information about the Tor instance",
    labelNames: ["serverName", "torInstance"],
  });
  torInstanceInfo.set({ serverName, torInstance }, 1);
  register.registerMetric(torInstanceInfo);

  app.get("/metrics", async (_req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await client.register.metrics());
  });

  server.listen(port, () => {
    logger.info(`Metrics server listening on port ${port}`);
  });

  return server;
}
