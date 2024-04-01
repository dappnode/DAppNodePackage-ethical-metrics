import { existsSync, statSync, readFileSync } from "fs";
import logger from "../logger/index.js";

const torInstanceFilePath = "/var/lib/tor/hidden_service/hostname";
const maxRetryInterval = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function loadTorInstance(): Promise<string> {
  let torInstance: string;
  let elapsedTime = 0;
  while (true) {
    if (existsSync(torInstanceFilePath)) {
      const stats = statSync(torInstanceFilePath);
      if (stats.isFile()) {
        torInstance =
          readFileSync(torInstanceFilePath, "utf8").trim() + ":9090";
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
  return torInstance;
}
