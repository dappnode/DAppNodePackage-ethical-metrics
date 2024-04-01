import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

export function loadServerName(): string {
  let serverName: string;
  if (process.env.SERVER_NAME) {
    serverName = process.env.SERVER_NAME;
  } else {
    serverName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      style: "capital",
      seed: "torInstance",
    });
  }
  return serverName;
}
