import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { $get } from "../../libs/axios";

const useGet = <DataT = unknown>(
  { url, params, ...rest }: AxiosRequestConfig,
  queryOptions?: UseQueryOptions<DataT, unknown>,
) =>
  useQuery({
    queryKey: [url, params],
    queryFn: ({ signal }) => $get<DataT>({ url, params, signal, ...rest }),
    ...queryOptions,
  });

export default useGet;
