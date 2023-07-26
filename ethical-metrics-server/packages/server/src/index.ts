import logger from "./modules/logger/index.js";
import { getFileContent } from "./fs/getFileContent.js";
import { startApi } from "./modules/server/index.js";
import { torInstanceFilePath } from "./params.js";

logger.info(`Starting Ethical Metrics UI...`);

let torInstance: string;

try {
  torInstance = (await getFileContent(torInstanceFilePath)).trim() + ':9090'; // Use helper method
} catch (error) {
  logger.error(`Error reading TOR instance file ${torInstanceFilePath}`, error as Error);
  process.exit(1);
}

logger.info(`Loaded TOR instance: ${torInstance}`);

const registerUrl = process.env.REGISTER_URL;
const email = process.env.EMAIL;

if (!registerUrl) {
  logger.error(`REGISTER_URL environment variable is not set`);
  process.exit(1);
}

if (!email) {
  logger.error(`EMAIL environment variable is not set`);
  process.exit(1);
}

// Start server API and serve UI
const server = startApi({
  torInstance,
  registerUrl,
  email,
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
