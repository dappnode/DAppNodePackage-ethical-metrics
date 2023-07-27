export interface UnregisterInstanceResponse {
    message: string;
}

export async function unregisterInstance(): Promise<UnregisterInstanceResponse> {
    try {
        const registerResponse = await fetch("/api/unregister", {
            method: 'POST',
        });

        if (!registerResponse.ok) {
            throw new Error(registerResponse.statusText);
        }

        return await registerResponse.json() as UnregisterInstanceResponse;
    } catch (error) {
        console.error('An error occurred while registering the instance:', error);
        throw error;
    }
}

