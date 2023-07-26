// helpers.js

const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');
const { SocksProxyAgent } = require('socks-proxy-agent');


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

// Helper function to make HTTP requests through Tor
const makeHttpRequestViaTor = async (method, url, data) => {
    try {
        // Tor SOCKS5 proxy address and port
        const torProxy = "socks5://tor-hidden-service.ethical-metrics.dappnode:9050";

        // Create an instance of the SocksProxyAgent
        const agent = new SocksProxyAgent(torProxy);

        // Axios configuration with the SOCKS5 agent
        const axiosConfig = {
            method,
            url,
            data,
            httpsAgent: agent, // Use the SOCKS5 agent for HTTPS requests
            httpAgent: agent,  // Use the SOCKS5 agent for HTTP requests (if necessary)
        };

        const response = await axios(axiosConfig);
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
    makeHttpRequestViaTor
};
