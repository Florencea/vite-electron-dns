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

export const $doh = async (
  url: string,
  name: string,
  signal: AbortSignal,
): Promise<{
  Answer: { type: number; data: string }[];
}> => {
  const fullUrl = new URL(url);
  fullUrl.searchParams.set("name", name);
  const res = await fetch(
    new Request(fullUrl, {
      method: "GET",
      signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/dns-json",
      },
    }),
  );
  const data = await res.json();
  return data;
};
