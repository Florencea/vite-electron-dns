import { useLocalStorageState } from "ahooks";
import { App, ButtonProps } from "antd";
import { InputProps } from "antd/es/input";
import { useState } from "react";
import useGetAll from "./api/useGetAll";

const useDoh = (servers: { title: string; server: string }[]) => {
  const { modal } = App.useApp();
  const [host, setHost] = useLocalStorageState("dns_hosts_doh", {
    defaultValue: "",
  });
  const [results, setResults] = useLocalStorageState<string[]>(
    "dns_hosts_result_doh",
    {
      defaultValue: [],
    },
  );
  const [enabled, setEnabled] = useState(false);
  const { isFetching } = useGetAll<{
    Answer: { type: number; data: string }[];
  }>(
    ["doh"],
    servers.map((s) => ({ url: s.server, params: { name: host } })),
    {
      enabled,
      onSuccess: (data) => {
        setEnabled(false);
        setResults(
          data.map((d) => d?.Answer.find((a) => a?.type === 1)?.data as string),
        );
      },
      onError: (err) => {
        setEnabled(false);
        modal.error({
          title: "DoH ERROR",
          content: (err as { message: string })?.message,
          icon: null,
          okText: "OK",
        });
      },
    },
  );
  const inputProps: InputProps = {
    value: host,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setHost(e.target.value);
    },
  };
  const buttonProps: ButtonProps = {
    onClick: () => {
      setEnabled(true);
    },
  };
  const clearAll = () => {
    setHost("");
    setResults([]);
  };
  return {
    host,
    inputProps,
    buttonProps,
    servers,
    results,
    isLoading: isFetching,
    clearAll,
  };
};

export default useDoh;
