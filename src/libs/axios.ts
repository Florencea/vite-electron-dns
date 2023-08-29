import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const AXIOS_INSTANCE = axios.create({
  timeout: 10000,
  paramsSerializer: { indexes: null },
  withCredentials: true,
});

export const $get = async <DataT = unknown>(option: AxiosRequestConfig) => {
  const res: AxiosResponse<DataT> = await AXIOS_INSTANCE({
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/dns-json",
    },
    ...option,
  });
  const { data } = res;
  return data;
};
