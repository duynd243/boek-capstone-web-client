import {AxiosInstance} from "axios";
import getAxiosClient from "./axiosClient";

export class BaseService {
    protected readonly axiosClient: AxiosInstance;

    constructor(accessToken?: string) {
        this.axiosClient = getAxiosClient(accessToken);
    }
}
