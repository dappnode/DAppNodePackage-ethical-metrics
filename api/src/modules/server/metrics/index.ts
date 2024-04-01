import express from "express";
import cors from "cors";
import http from "node:http";
import client from "prom-client";

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

  app.get("/metrics", async (_req, res) => {
    const register = new client.Registry();
    const torInstanceInfo = new client.Gauge({
      name: "tor_instance_info",
      help: "Information about the Tor instance",
      labelNames: ["serverName", "torInstance"],
    });

    torInstanceInfo.set({ serverName, torInstance }, 1);
    register.registerMetric(torInstanceInfo);
    res.set("Content-Type", register.contentType);
    res.end(await client.register.metrics());
  });

  server.listen(port, () => {
    console.log(`Metrics server listening on port ${port}`);
  });

  return server;
}
