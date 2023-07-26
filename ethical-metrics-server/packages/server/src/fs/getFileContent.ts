import path from "path";
import fs from "fs/promises";
import logger from "../modules/logger";

// Helper function to read the file content
export async function getFileContent(filePath: string): Promise<string> {
    try {
        return await fs.readFile(path.resolve(filePath), 'utf8');
    } catch (error) {
        logger.error(`Error reading file ${filePath}`, error as Error);
        throw error;
    }
};