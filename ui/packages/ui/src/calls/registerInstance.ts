export interface RegisterInstanceResponse {
    message: string;
}

export async function registerInstance(): Promise<RegisterInstanceResponse> {
    try {
        const registerResponse = await fetch("api/register", {
            method: 'POST',
        });

        if (!registerResponse.ok) {
            throw new Error(registerResponse.statusText);
        }

        return await registerResponse.json() as RegisterInstanceResponse;
    } catch (error) {
        console.error('An error occurred while registering the instance:', error);
        throw error;
    }
}
