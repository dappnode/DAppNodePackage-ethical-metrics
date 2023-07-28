import path from "path";
import { PeerPkgs } from "@ethical-metrics/common"

export const pkgsHealthUrlMap: { [key in PeerPkgs]: string } = {
    [PeerPkgs.DMS]: 'http://prometheus.dms.dappnode:9090/-/healthy',
    [PeerPkgs.EXPORTER]: 'http://cadvisor.dappnode-exporter.dappnode:8080/healthz',
};

export const torInstanceFilePath = "/var/lib/tor/hidden_service/hostname";

export const torProxyUrl = "socks5://tor-hidden-service.ethical-metrics.dappnode:9050";

const uiBuildDirName = "uiBuild";
export const uiBuildPath = path.resolve(process.cwd(), uiBuildDirName);
