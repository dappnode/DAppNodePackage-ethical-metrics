import { PeerPkgs } from "@ethical-metrics/common";

// Checks if a healthcheck endpoint returns 200
export async function isPackageHealthy(pkg: PeerPkgs) {
    try {
        console.log(`Checking health of package ${pkg}`);
        const healthResponse = await fetch(`http://localhost:80/api/package-healthcheck?package=${pkg}`);
        return healthResponse.status === 200;
    } catch (e) {
        return false;
    }
}