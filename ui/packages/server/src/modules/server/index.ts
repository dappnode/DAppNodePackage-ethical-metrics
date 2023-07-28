import express from 'express';
import path from 'path';
import cors from 'cors';
import http from 'node:http';
import { makeHttpRequestViaTor } from './makeHttpRequestViaTor.js';
import { pkgsHealthUrlMap, uiBuildPath } from '../../params.js';
import { PeerPkgs } from "@ethical-metrics/common";
import logger from '../logger/index.js';
import axios from 'axios';

export function startApi({
    torInstance,
    registerUrl,
    email,
    port = 80,
}: {
    torInstance: string,
    registerUrl: string,
    email: string,
    port?: number,
}): http.Server {

    const app = express();
    const server = new http.Server(app);
    app.use(express.json());
    app.use(cors());

    // Return the TOR instance
    app.get('/api/instance', async (_req, res) => {
        try {
            res.json({ instance: torInstance });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    app.get('/api/package-healthcheck', async (req, res) => {

        const pkg = req.query.package;

        logger.debug(`Healthcheck requested for package ${pkg}`);

        // If pkgStr is not PeerPkgs, return 400
        if (!Object.values(PeerPkgs).includes(pkg as PeerPkgs)) {
            res.status(400).json({ message: "Invalid package name" });
            return;
        }

        // Get the healthcheck status of the package
        try {
            const healthCheckUrl = pkgsHealthUrlMap[pkg as PeerPkgs];
            logger.debug(`Checking health for package ${pkg} (${healthCheckUrl})`);
            const response = await axios.get(healthCheckUrl);
            res.status(response.status).json({ message: "OK" });
        } catch (e) {
            logger.error(`Error checking health for package ${pkg}`, e as Error);
            res.status(500).send();
        }
    });

    // Endpoint to handle registration
    app.post('/api/register', async (_req, res) => {
        try {
            const postBody = {
                instance: torInstance,
                mail: email,
            };

            console.log('Registering instance: ', postBody);
            const message = await makeHttpRequestViaTor('POST', registerUrl, postBody);

            res.json({ message });
        } catch (error) {
            res.status(500).send((error as Error).message || 'Failed to register onion instance');
        }
    });

    // Endpoint to handle unregistration
    app.post('/api/unregister', async (req, res) => {
        try {
            const deleteBody = [
                {
                    instance: torInstance,
                },
            ];

            console.log('Unregistering instance:', deleteBody);
            const message = await makeHttpRequestViaTor('DELETE', registerUrl, deleteBody); // Use helper method

            res.json({ message });
        } catch (error) {
            res.status(500).send((error as Error).message || 'Failed to unregister onion instance');
        }
    });

    // Serve static files from the "public" directory
    app.use(express.static(uiBuildPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(uiBuildPath, "index.html"));
    });

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    return server;
}
