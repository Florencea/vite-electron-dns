import {
  ClearOutlined,
  LoadingOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import { App, ButtonProps } from "antd";
import { InputProps } from "antd/es/input";
import { useCallback, useMemo, useState } from "react";
import useDohRequest from "./useDohRequest";

const useDoh = (servers: { title: string; server: string }[]) => {
  const { modal } = App.useApp();
  const [host, setHost] = useState("");
  const [resultsA, setResultsA] = useState([]);
  const [resultsAAAA, setResultsAAAA] = useState([]);
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

  const isLoading = isFetchingA || isFetchingAAAA;

  const clearAll = useCallback(() => {
    setHost("");
    setResultsA([]);
    setResultsAAAA([]);
  }, []);

  const inputProps: InputProps = useMemo(
    () => ({
      title: `Domain Name\n(Single)`,
      className: "w-[300px]",
      allowClear: true,
      disabled: isLoading,
      value: host,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setHost(e.target.value);
      },
      onKeyDown: (e) => {
        if (e.code === "Enter") {
          setEnabled(true);
        }
      },
    }),
    [host, isLoading],
  );

  const btnSubmitProps: ButtonProps = useMemo(
    () => ({
      type: "primary",
      disabled: isLoading || !host,
      onClick: () => {
        setEnabled(true);
      },
      children: isLoading ? <LoadingOutlined /> : <SwapRightOutlined />,
    }),
    [host, isLoading],
  );

  const btnClearProps: ButtonProps = useMemo(
    () => ({
      danger: true,
      disabled: isLoading,
      onClick: () => {
        clearAll();
      },
      children: <ClearOutlined />,
    }),
    [clearAll, isLoading],
  );

  const results = useMemo(
    () => resultsA.map((a, idx) => [a, resultsAAAA[idx]].join("\n")),
    [resultsA, resultsAAAA],
  );

  return {
    host,
    inputProps,
    btnSubmitProps,
    btnClearProps,
    servers,
    results,
    isLoading: isFetchingA || isFetchingAAAA,
    clearAll,
  };
};

export default useDoh;
