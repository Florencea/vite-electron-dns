import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { $get } from "../../libs/axios";

const useGetAll = <DataT = unknown>(
  queryKey: string[],
  reqConfigs: AxiosRequestConfig[],
  queryOptions?: UseQueryOptions<DataT[], unknown>,
) =>
  useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      Promise.all(
        reqConfigs.map(({ url, params, ...rest }) =>
          $get<DataT>({ url, params, signal, ...rest }),
        ),
      ),
    ...queryOptions,
  });

export default useGetAll;
