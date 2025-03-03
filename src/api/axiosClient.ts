import axios, { AxiosRequestConfig } from "axios";
import { apiHandle } from "./api";

const apiKey = process.env.API_KEY;


// Function to create an Axios instance with optional token
const authApi = (token: string | null = null) => {
    const headers: Record<string, string> = {};
    if (token) {
        headers["api-key"] = `${apiKey}`;
    }

    return axios.create({
        baseURL: apiHandle, // Sử dụng baseURL thay vì apiHandle
        headers, // Headers được thêm tùy theo điều kiện
    });
};

// Function to handle API requests with support for different HTTP methods
const handleAPI = async (
    url: string,
    method: 'POST' | 'PATCH' | 'GET' | 'DELETE' = 'GET',
    data?: any,
    token: string | null = null
) => {
    try {
        const apiInstance = authApi(token);
        const config: AxiosRequestConfig = {
            url,
            method,
            data,
        };
        const response = await apiInstance(config);
        return response.data;
    } catch (error) {
        // Handle error here (logging or custom error message)
        throw error;
    }
};

export default handleAPI;
export { handleAPI };
