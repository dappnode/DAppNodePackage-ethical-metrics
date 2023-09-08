import { SocksProxyAgent } from "socks-proxy-agent";
import axios, { AxiosRequestConfig } from "axios";
import { torProxyUrl } from "../../params.js";
import logger from "../logger/index.js";

// Helper function to make HTTP requests through Tor
export async function makeHttpRequestViaTor(
  method: "POST" | "DELETE" | "GET",
  url: string,
  data?: AxiosRequestConfig["data"]
) {
  try {
    // Create an instance of the SocksProxyAgent
    const agent = new SocksProxyAgent(torProxyUrl);

    // Axios configuration with the SOCKS5 agent
    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      data,
      httpsAgent: agent, // Use the SOCKS5 agent for HTTPS requests
      httpAgent: agent, // Use the SOCKS5 agent for HTTP requests (if necessary)
    };

    const response = await axios(axiosConfig);
    return response.data;
  } catch (error) {
    logger.error(`Error making HTTP request via Tor`, error as Error);
    throw error;
  }
}
