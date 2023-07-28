import { PeerPkgs } from "@ethical-metrics/common";

// Checks if a healthcheck endpoint returns 200
export async function isPackageHealthy(pkg: PeerPkgs) {
    try {
        const healthResponse = await fetch(`/api/package-healthcheck?package=${pkg}`);
        return healthResponse.status === 200;
    } catch (e) {
        return false;
    }
}