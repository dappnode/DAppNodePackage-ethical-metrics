const express = require('express');
const path = require('path');
const helpers = require('./helpers'); // Import helper methods
const middleware = require('./middleware'); // Import middleware
const fs = require('fs').promises;

require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;
const REGISTER_URL = process.env.REGISTER_URL;
const EMAIL = process.env.EMAIL;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the frontend index.html file
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../index.html');

    fs.readFile(filePath, 'utf8')
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send('Error reading index.html');
        });
});

// Endpoint to read the instance
app.get('/api/getFileContent', async (req, res) => {
    try {
        const content = await helpers.getFileContent(); // Use helper method
        res.json({ content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to handle registration
app.post('/api/register', async (req, res) => {
    try {
        const instance = (await helpers.getFileContent()).trim() + ':9090'; // Use helper method
        const postBody = {
            instance,
            mail: EMAIL, // Assuming the email is sent in the request body from the frontend
        };

        console.log('HTTP POST body:', postBody);
        // Make the HTTP POST request to the register API using the helper method
        const message = await helpers.makeHttpRequest('POST', REGISTER_URL, postBody); // Use helper method
        console.log('Register API response:', message);

        // Send success feedback to the frontend
        res.json({ message });
    } catch (error) {
        // Send error feedback to the frontend
        res.status(500).send(error.message || 'Failed to register onion instance');
    }
});

// Endpoint to handle unregistration
app.post('/api/unregister', async (req, res) => {
    try {
        const instance = (await helpers.getFileContent()).trim() + ':9090'; // Use helper method
        const deleteBody = [
            {
                instance,
            },
        ];

        console.log('Request body:', deleteBody);
        // Make the HTTP DELETE request using the helper method
        const message = await helpers.makeHttpRequest('DELETE', REGISTER_URL, deleteBody); // Use helper method
        console.log('Unregister API response:', message);

        // Send success feedback to the frontend
        res.json({ message });
    } catch (error) {
        // Send error feedback to the frontend
        res.status(500).send(error.message || 'Failed to unregister onion instance');
    }
});

// Error handling middleware
app.use(middleware.errorHandler); // Use the error handling middleware

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
