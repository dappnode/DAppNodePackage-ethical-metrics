// backend/app.js (Backend)

const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); 

require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;

// Serve the frontend index.html file
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../index.html');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading index.html');
        } else {
            res.send(data);
        }
    });
});

// Endpoint to read the file content
app.get('/api/getFileContent', (req, res) => {
    const filePath = path.resolve('/var/lib/tor/hidden_service/hostname'); 
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ error: 'Error reading file' });
        } else {
            res.json({ content: data });
        }
    });
});

app.post('/api/register', async (req, res) => {
    try {
        const INSTANCE_FILE = '/var/lib/tor/hidden_service/hostname';
        const REGISTER_URL = process.env.REGISTER_URL;
        const EMAIL = process.env.EMAIL;

        const instance = fs.readFileSync(INSTANCE_FILE, 'utf8').trim() + ':9090';

        const postBody = {
            instance,
            mail: EMAIL, // Assuming the email is sent in the request body from the frontend
        };

        console.log('HTTP POST body:', postBody);

        // Make the HTTP POST request to the register API using Axios
        const response = await axios.post(REGISTER_URL, postBody);

        // Handle the response data for the register API call if needed
        console.log('Register API response:', response.data);

        res.json({ message: 'Onion instance registered successfully' });
    } catch (error) {
        console.error('Error in register API call:', error);
        res.status(500).json({ error: 'Failed to register onion instance' });
    }
});

// Endpoint to unregister the onion instance
app.post('/api/unregister', async (req, res) => {
    try {
        const INSTANCE_FILE = '/var/lib/tor/hidden_service/hostname';
        const UNREGISTER_URL = process.env.REGISTER_URL;

        const instance = fs.readFileSync(INSTANCE_FILE, 'utf8').trim() + ':9090';

        const deleteBody = [
            {
                instance,
            },
        ];

        console.log('Request body:', deleteBody);

        // Make the HTTP DELETE request using Axios
        const response = await axios.delete(UNREGISTER_URL, {
            data: deleteBody, // Specify the data in the request body for DELETE method
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                inactiveDelay: 'true',
            },
        });

        // Handle the response data for the unregister API call if needed
        console.log('Unregister API response:', response.data);

        res.json({ message: 'Onion instance unregistered successfully' });
    } catch (error) {
        console.error('Error in unregister API call:', error);
        res.status(500).json({ error: 'Failed to unregister onion instance' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});