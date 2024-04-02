import logger from "./modules/logger/index.js";
import { startRegisterApi } from "./modules/server/register/index.js";
import axios from "axios";
import { loadServerName, loadTorInstance } from "./modules/env/index.js";
import { startMetricsApi } from "./modules/server/metrics/index.js";

const registerUrl = "https://ethical-metrics.dappnode.io";
logger.info(`Using register URL: ${registerUrl}`);

logger.info(`Retrieving tor instance...`);
const torInstance = await loadTorInstance();
logger.info(`Loaded TOR instance: ${torInstance}`);

logger.info(`Retrieving server name...`);
const serverName = await loadServerName();
logger.info(`Loaded server name: ${serverName}`);

// Start server API
logger.info(`Starting register API...`);
const registerServer = startRegisterApi({
  torInstance,
  registerUrl,
  serverName,
});
logger.info(`Starting metrics API...`);
const metricsServer = startMetricsApi({
  torInstance,
  serverName,
});

// Graceful shutdown
function handle(signal: string): void {
  logger.info(`${signal} received. Shutting down...`);
  registerServer.close();
  metricsServer.close();
  process.exit(0);
}

process.on("SIGTERM", () => handle("SIGTERM"));
process.on("SIGINT", () => handle("SIGINT"));
process.on("SIGQUIT", () => handle("SIGQUIT"));
