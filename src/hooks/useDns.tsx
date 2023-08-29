import { useLocalStorageState } from "ahooks";
import { App, ButtonProps } from "antd";
import useIpcPost from "./api/useIpcPost";

const useDns = (servers: { title: string; server: string }[]) => {
  const { modal } = App.useApp();
  const [hosts, setHosts] = useLocalStorageState("dns_hosts", {
    defaultValue: "",
  });
  const [results, setResults] = useLocalStorageState<string[]>(
    "dns_hosts_result",
    {
      defaultValue: [],
    },
  );
  const Dns = useIpcPost<string[], { hosts: string; servers: string[] }>(
    {
      channel: "dns",
    },
    {
      onSuccess: (data) => {
        setResults(data);
      },
      onError: (err) => {
        const [title, content] = (err as { message: string }).message.split(
          "|",
        );
        modal.error({
          title,
          content,
          icon: null,
          okText: "OK",
        });
      },
    },
  );
  const inputProps = {
    value: hosts,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHosts(e.target.value);
    },
  };
  const buttonProps: ButtonProps = {
    onClick: () => {
      Dns.mutate({
        hosts: hosts as string,
        servers: servers.map((s) => s.server),
      });
    },
  };
  const clearAll = () => {
    setHosts("");
    setResults([]);
  };
  return {
    hosts,
    inputProps,
    buttonProps,
    servers,
    results,
    isLoading: Dns.isLoading,
    clearAll,
  };
};

export default useDns;
