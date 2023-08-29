import { ipcRenderer } from "electron";
import { isNil } from "lodash-es";

export interface IpcResT<DataT = unknown> {
  msg?: string;
  data: DataT;
}

export const $ipcGet = async <DataT = unknown, ParamsT = unknown>(
  channel: string,
  params: ParamsT,
) => {
  const { data, msg = "" }: IpcResT<DataT> = await ipcRenderer.invoke(
    channel,
    params,
  );
  if (isNil(data)) {
    throw new Error(msg);
  }
  return data;
};

export const $ipcPost = async <DataT = unknown, ReqDataT = unknown>(
  channel: string,
  reqData: ReqDataT,
) => {
  const { data, msg = "" }: IpcResT<DataT> = await ipcRenderer.invoke(
    channel,
    reqData,
  );
  if (isNil(data)) {
    throw new Error(msg);
  }
  return data;
};
