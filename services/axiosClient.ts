import axios, { AxiosInstance, AxiosResponse } from "axios";
import qs from "qs";

const getAxiosClient = (
    accessToken?: string,
    customURL?: string,
): AxiosInstance => {
    const axiosClient = axios.create({

        baseURL: customURL ?? process.env.NEXT_PUBLIC_API_URL,
    });
    axiosClient.interceptors.request.use((config) => {
        if (config.headers && accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        config.paramsSerializer = {
            serialize: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
        };
        return config;
    });

    axiosClient.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error) => Promise.reject(error.response && error.response.data),
    );

    return axiosClient;
};

export default getAxiosClient;
