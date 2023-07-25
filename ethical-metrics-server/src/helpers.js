// helpers.js

const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');

// Helper function to read the file content
const getFileContent = async () => {
    try {
        const filePath = path.resolve('/var/lib/tor/hidden_service/hostname');
        return await fs.readFile(filePath, 'utf8');
    } catch (error) {
        console.error('Error reading file:', error);
        throw new Error('Error reading file');
    }
};

// Helper function to make HTTP requests
const makeHttpRequest = async (method, url, data) => {
    try {
        const response = await axios({ method, url, data });
        return response.data;
    } catch (error) {
        console.error(`Error in ${method} API call:`, error);
        if (error.response) {
            throw new Error(error.response.data);
        } else {
            throw new Error('Failed to perform API call');
        }
    }
};

module.exports = {
    getFileContent,
    makeHttpRequest,
};
