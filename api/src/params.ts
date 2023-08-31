import path from "path";

export enum PeerPkgs {
  DMS = "DMS",
  EXPORTER = "Exporter",
}

export const pkgsHealthUrlMap: { [key in PeerPkgs]: string } = {
  [PeerPkgs.DMS]: "http://prometheus.dms.dappnode:9090/-/healthy",
  [PeerPkgs.EXPORTER]:
    "http://cadvisor.dappnode-exporter.dappnode:8080/healthz",
};

export const torInstanceFilePath = "/var/lib/tor/hidden_service/hostname";

export const torProxyUrl =
  "socks5://tor-hidden-service.ethical-metrics.dappnode:9050";
