import path from "path";

export const torInstanceFilePath = "/var/lib/tor/hidden_service/hostname";

export const torProxyUrl = "socks5://tor-hidden-service.ethical-metrics.dappnode:9050";

const uiBuildDirName = "uiBuild";
export const uiBuildPath = path.resolve(process.cwd(), uiBuildDirName);
