import { useLocalStorageState } from "ahooks";
import { App, ButtonProps } from "antd";
import { InputProps } from "antd/es/input";
import { useMemo, useState } from "react";
import useDohRequest from "./useDohRequest";

const useDoh = (servers: { title: string; server: string }[]) => {
  const { modal } = App.useApp();
  const [host, setHost] = useLocalStorageState("dns_hosts_doh", {
    defaultValue: "",
  });
  const [resultsA, setResultsA] = useLocalStorageState<string[]>(
    "dns_hosts_result_doh_A",
    {
      defaultValue: [],
    },
  );
  const [resultsAAAA, setResultsAAAA] = useLocalStorageState<string[]>(
    "dns_hosts_result_doh_AAAA",
    {
      defaultValue: [],
    },
  );
  const [enabled, setEnabled] = useState(false);
  const { isFetching: isFetchingA } = useDohRequest(
    ["dohA"],
    servers.map(({ server }) => ({ url: server, name: host, type: "A" })),
    {
      enabled,
      onSuccess: (data) => {
        setEnabled(false);
        setResultsA(data.map((d) => d?.Answer?.map((d) => d.data)?.join("\n")));
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
  const { isFetching: isFetchingAAAA } = useDohRequest(
    ["dohAAAA"],
    servers.map(({ server }) => ({ url: server, name: host, type: "AAAA" })),
    {
      enabled,
      onSuccess: (data) => {
        setEnabled(false);
        setResultsAAAA(
          data.map((d) => d?.Answer?.map((d) => d.data)?.join("\n")),
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
    setResultsA([]);
    setResultsAAAA([]);
  };
  const results = useMemo(
    () => resultsA.map((a, idx) => [a, resultsAAAA[idx]].join("\n")),
    [resultsA, resultsAAAA],
  );
  return {
    host,
    inputProps,
    buttonProps,
    servers,
    results,
    isLoading: isFetchingA || isFetchingAAAA,
    clearAll,
  };
};

export default useDoh;
