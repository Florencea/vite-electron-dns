import {
  ClearOutlined,
  LoadingOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { isEmpty } from "lodash-es";
import { Input } from "../components/Input";
import { TextArea } from "../components/TextArea";
import useDoh from "../hooks/useDoh";

export default function Doh() {
  const {
    host,
    buttonProps,
    inputProps,
    servers,
    results,
    isLoading,
    clearAll,
  } = useDoh([
    { title: "Google", server: "https://dns.google/resolve" },
    { title: "Cloudflare", server: "https://cloudflare-dns.com/dns-query" },
    { title: "Quad101", server: "https://dns.twnic.tw/dns-query" },
    { title: "NextDNS", server: "https://dns.nextdns.io" },
  ]);
  return (
    <div className="w-full h-full p-4">
      <div className="w-full h-full flex justify-between items-stretch gap-2">
        <Input
          {...inputProps}
          title={`Domain Name\n(Single)`}
          className="w-[300px]"
          allowClear
          disabled={isLoading}
        />
        <div className="self-center flex flex-col gap-3">
          <Button
            {...buttonProps}
            type="primary"
            disabled={isLoading || isEmpty(host)}
          >
            {isLoading ? <LoadingOutlined /> : <SwapRightOutlined />}
          </Button>
          <Button
            danger
            disabled={isLoading}
            onClick={() => {
              clearAll();
            }}
          >
            <ClearOutlined />
          </Button>
        </div>

        {servers.map(({ title, server }, idx) => (
          <TextArea
            key={server}
            title={`${title}\n(${server})`}
            value={results?.[idx]}
            readOnly
            disabled={isLoading}
          />
        ))}
      </div>
    </div>
  );
}
