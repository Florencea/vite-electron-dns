import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { $ipcGet } from "../../libs/ipc";

const useIpcGet = <DataT = unknown, ParamsT = unknown>(
  { channel, params }: { channel: string; params: ParamsT },
  queryOptions?: UseQueryOptions<DataT, unknown>,
) =>
  useQuery({
    queryKey: [channel],
    queryFn: () => $ipcGet<DataT, ParamsT>(channel, params),
    ...queryOptions,
  });

export default useIpcGet;
