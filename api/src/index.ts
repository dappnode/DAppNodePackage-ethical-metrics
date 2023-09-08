import { existsSync, statSync, readFileSync } from "fs";
import logger from "./modules/logger/index.js";
import { startApi } from "./modules/server/index.js";

const registerUrl = "https://ethical-metrics.dappnode.io";
logger.info(`Using register URL: ${registerUrl}`);

logger.info(`Retrieving tor instance...`);
const torInstanceFilePath = "/var/lib/tor/hidden_service/hostname";
const maxRetryInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
let torInstance: string;
let elapsedTime = 0;
while (true) {
  if (existsSync(torInstanceFilePath)) {
    const stats = statSync(torInstanceFilePath);
    if (stats.isFile()) {
      torInstance = readFileSync(torInstanceFilePath, "utf8").trim() + ":9090";
      break;
    }
  }
  if (elapsedTime >= maxRetryInterval) {
    logger.error(`Error reading TOR instance file ${torInstanceFilePath}`);
    process.exit(1);
  }
  elapsedTime += 5000;
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
logger.info(`Loaded TOR instance: ${torInstance}`);

// Start server API
logger.info(`Starting Ethical Metrics API...`);
const server = startApi({
  torInstance,
  registerUrl,
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
