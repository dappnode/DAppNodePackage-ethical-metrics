import express from 'express';
import path from 'path';
import cors from 'cors';
import http from 'node:http';
import { makeHttpRequestViaTor } from './makeHttpRequestViaTor.js';
import { uiBuildPath } from '../../params.js';

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

    // Serve the frontend index.html file
    /*app.get('/', (_req, res) => {
        const filePath = path.join(__dirname, '../index.html');

        fs.readFile(filePath, 'utf8')
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send('Error reading index.html');
            });
    });*/

    // Endpoint to read the instance
    app.get('/api/instance', async (_req, res) => {
        try {
            res.json({ instance: torInstance });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    // Endpoint to handle registration
    app.post('/api/register', async (_req, res) => {
        try {
            const postBody = {
                instance: torInstance,
                mail: email, // Assuming the email is sent in the request body from the frontend
            };

            console.log('HTTP POST body:', postBody);
            // Make the HTTP POST request to the register API using the helper method
            const message = await makeHttpRequestViaTor('POST', registerUrl, postBody); // Use helper method
            console.log('Register API response:', message);

            // Send success feedback to the frontend
            res.json({ message });
        } catch (error) {
            // Send error feedback to the frontend
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

            console.log('Request body:', deleteBody);
            // Make the HTTP DELETE request using the helper method
            const message = await makeHttpRequestViaTor('DELETE', registerUrl, deleteBody); // Use helper method
            console.log('Unregister API response:', message);

            // Send success feedback to the frontend
            res.json({ message });
        } catch (error) {
            // Send error feedback to the frontend
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
