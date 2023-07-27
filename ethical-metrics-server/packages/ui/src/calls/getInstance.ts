interface InstanceResponse {
    instance: string;
}

export async function getInstance(): Promise<InstanceResponse> {
    try {
        const response = await fetch("/api/instance");
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json() as InstanceResponse;
    } catch (error) {
        console.error("An error occurred while getting the instance:", error);
        throw error;
    }
}