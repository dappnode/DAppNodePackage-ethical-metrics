// backend/app.js (Backend)

const express = require('express');
const fs = require('fs');
const path = require('path');
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


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});