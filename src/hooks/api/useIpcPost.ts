import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { $ipcPost } from "../../libs/ipc";

const useIpcPost = <DataT = unknown, ReqDataT = unknown>(
  { channel }: { channel: string },
  mutateOptions?: UseMutationOptions<DataT, unknown, ReqDataT>,
) =>
  useMutation({
    mutationKey: [channel],
    mutationFn: (data) => $ipcPost<DataT, ReqDataT>(channel, data),
    ...mutateOptions,
  });

export default useIpcPost;
