import {
  ClearOutlined,
  LoadingOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import { App, ButtonProps } from "antd";
import { InputProps } from "antd/es/input";
import { useCallback, useEffect, useMemo, useState } from "react";
import useDohRequest from "./useDohRequest";

const useDoh = (servers: { title: string; server: string }[]) => {
  const { message } = App.useApp();
  const [host, setHost] = useState("");
  const [resultsA, setResultsA] = useState([]);
  const [resultsAAAA, setResultsAAAA] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const {
    data: dataA,
    isFetching: isFetchingA,
    isSuccess: isSuccessA,
  } = useDohRequest(
    servers.map(({ server }) => ({ url: server, name: host, type: "A" })),
    {
      queryKey: ["dohA"],
      enabled,
      meta: {
        onError: (err: Error) => {
          setEnabled(false);
          message.error({
            content: `ipv4: ${err?.message}`,
            icon: null,
            duration: 4.5,
          });
        },
      },
    },
  );
  const {
    data: dataAAAA,
    isFetching: isFetchingAAAA,
    isSuccess: isSuccessAAAA,
  } = useDohRequest(
    servers.map(({ server }) => ({ url: server, name: host, type: "AAAA" })),
    {
      queryKey: ["dohAAAA"],
      enabled,
      meta: {
        onError: (err: Error) => {
          setEnabled(false);
          message.error({
            content: `ipv6: ${err?.message}`,
            icon: null,
            duration: 4.5,
          });
        },
      },
    },
  );

  useEffect(() => {
    if (isSuccessA) {
      setEnabled(false);
      setResultsA(dataA.map((d) => d?.Answer?.map((d) => d.data)?.join("\n")));
    }
  }, [dataA, isSuccessA]);

  useEffect(() => {
    if (isSuccessAAAA) {
      setEnabled(false);
      setResultsAAAA(
        dataAAAA.map((d) => d?.Answer?.map((d) => d.data)?.join("\n")),
      );
    }
  }, [dataAAAA, isSuccessAAAA]);

  const isLoading = isFetchingA || isFetchingAAAA;

  const clearAll = useCallback(() => {
    setHost("");
    setResultsA([]);
    setResultsAAAA([]);
  }, []);

  const submit = useCallback(() => {
    setResultsA([]);
    setResultsAAAA([]);
    setEnabled(true);
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
          submit();
        }
      },
    }),
    [host, isLoading, submit],
  );

  const btnSubmitProps: ButtonProps = useMemo(
    () => ({
      type: "primary",
      disabled: isLoading || !host,
      onClick: () => {
        submit();
      },
      children: isLoading ? <LoadingOutlined /> : <SwapRightOutlined />,
    }),
    [host, isLoading, submit],
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
