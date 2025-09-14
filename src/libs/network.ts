const API_BASE_URL = "https://localhost:7283";

interface ApiError extends Error {
    status?: number;
    data?: any;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

// Helper function to get headers with authentication
const getHeaders = (isFormData: boolean = false, customHeaders?: HeadersInit): HeadersInit => {
    const authToken = getAuthToken();
    const baseHeaders: HeadersInit = isFormData ? {} : { 'Content-Type': 'application/json' };

    const headers: HeadersInit = {
        ...baseHeaders,
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...customHeaders,
    };

    return headers;
};

export const apiClient = {
    get: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
        try {
            const headers = getHeaders(false, options?.headers);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                method: "GET",
                headers,
            });

            if (!response.ok) {
                const errorData = await parseErrorResponse(response);
                throw createApiError(response.status, errorData);
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof Error) {
                throw enhanceError(error);
            }
            throw new Error('Unknown error occurred');
        }
    },

    post: async <T>(endpoint: string, data: any, options?: RequestInit): Promise<T> => {
        try {
            const isFormData = data instanceof FormData;
            const headers = getHeaders(isFormData, options?.headers);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers,
                body: isFormData ? data : JSON.stringify(data),
                ...options,
            });

            if (!response.ok) {
                const errorData = await parseErrorResponse(response);
                throw createApiError(response.status, errorData);
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof Error) {
                throw enhanceError(error);
            }
            throw new Error('Unknown error occurred');
        }
    },

    delete: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
        try {
            const headers = getHeaders(false, options?.headers);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "DELETE",
                headers,
                ...options,
            });

            if (!response.ok) {
                const errorData = await parseErrorResponse(response);
                throw createApiError(response.status, errorData);
            }

            if (response.status === 204) {
                return {} as T;
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof Error) {
                throw enhanceError(error);
            }
            throw new Error('Unknown error occurred');
        }
    },

    put: async <T>(endpoint: string, data: any, options?: RequestInit): Promise<T> => {
        try {
            const isFormData = data instanceof FormData;
            const headers = getHeaders(isFormData, options?.headers);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "PUT",
                headers,
                body: isFormData ? data : JSON.stringify(data),
                ...options,
            });

            if (!response.ok) {
                const errorData = await parseErrorResponse(response);
                throw createApiError(response.status, errorData);
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof Error) {
                throw enhanceError(error);
            }
            throw new Error('Unknown error occurred');
        }
    },

    patch: async <T>(endpoint: string, data: any, options?: RequestInit): Promise<T> => {
        try {
            const isFormData = data instanceof FormData;
            const headers = getHeaders(isFormData, options?.headers);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "PATCH",
                headers,
                body: isFormData ? data : JSON.stringify(data),
                ...options,
            });

            if (!response.ok) {
                const errorData = await parseErrorResponse(response);
                throw createApiError(response.status, errorData);
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof Error) {
                throw enhanceError(error);
            }
            throw new Error('Unknown error occurred');
        }
    },
};

async function parseErrorResponse(response: Response): Promise<any> {
    try {
        return await response.json();
    } catch {
        return { message: response.statusText };
    }
}

function createApiError(status: number, data: any): ApiError {
    const error: ApiError = new Error(data.message || `HTTP error ${status}`);
    error.status = status;
    error.data = data;
    return error;
}

function enhanceError(error: Error): ApiError {
    const apiError: ApiError = error;
    if (!apiError.status) apiError.status = 500;
    if (!apiError.data) apiError.data = { message: error.message };
    return apiError;
}
