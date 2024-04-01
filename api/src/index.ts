import logger from "./modules/logger/index.js";
import { startApi } from "./modules/server/index.js";
import axios from "axios";
import { loadServerName, loadTorInstance } from "./modules/env/index.js";

const registerUrl = "https://ethical-metrics.dappnode.io";
logger.info(`Using register URL: ${registerUrl}`);

logger.info(`Retrieving tor instance...`);
const torInstance = await loadTorInstance();
logger.info(`Loaded TOR instance: ${torInstance}`);

logger.info(`Retrieving server name...`);
const serverName = loadServerName();
logger.info(`Loaded server name: ${serverName}`);

// post to the dappmanager the server name "http://my.dappnode/data-send?key=serverName&data=${serverName}" POST
await axios.post("http://my.dappnode/data-send", {
  key: "serverName",
  data: serverName,
});

// Start server API
logger.info(`Starting Ethical Metrics API...`);
const server = startApi({
  torInstance,
  registerUrl,
  serverName,
});

// Graceful shutdown
function handle(signal: string): void {
  logger.info(`${signal} received. Shutting down...`);
  server.close();
  process.exit(0);
}

process.on("SIGTERM", () => handle("SIGTERM"));
process.on("SIGINT", () => handle("SIGINT"));
process.on("SIGQUIT", () => handle("SIGQUIT"));
