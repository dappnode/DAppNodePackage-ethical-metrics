import axios from "axios";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import logger from "../logger/index.js";

export async function loadServerName(torInstance: string): Promise<string> {
  const regexServerName = /^[a-zA-Z0-9]([a-zA-Z0-9\-_]{0,62})?[a-zA-Z0-9]$/;
  let serverName: string;

  if (
    process.env.SERVER_NAME &&
    regexServerName.test(process.env.SERVER_NAME)
  ) {
    serverName = process.env.SERVER_NAME;
  } else {
    serverName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      style: "capital",
      seed: torInstance,
    });
  }
  // post to the dappmanager the server name "http://my.dappnode/data-send?key=serverName&data=${serverName}" POST
  await axios
    .post(`http://my.dappnode/data-send?key=serverName&data=${serverName}`)
    .catch((error) =>
      logger.error(`Error sending server name to the dappmanager: ${error}`)
    );

  return serverName;
}
