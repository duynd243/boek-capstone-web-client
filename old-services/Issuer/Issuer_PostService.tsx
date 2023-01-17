import React from "react";
import { AxiosInstance } from "axios";
import getAxiosClient from "../axiosClient";

export class IssuerPostService {
  private readonly axiosClient: AxiosInstance;

  constructor(accessToken?: string) {
    this.axiosClient = getAxiosClient(accessToken);
  }

  createPost$Issuer = async (data: any) => {
    const response = await this.axiosClient.post("/issuer/posts", data);
    return response.data;
  };
}
