import {
  ClearOutlined,
  LoadingOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { TextArea } from "../components/TextArea";
import useDns from "../hooks/useDns";

export default function Dns() {
  const {
    hosts,
    buttonProps,
    inputProps,
    servers,
    results,
    isLoading,
    clearAll,
  } = useDns([
    { title: "Google", server: "8.8.8.8" },
    { title: "Cloudflare", server: "1.1.1.1" },
    { title: "Hinet", server: "168.95.192.1" },
    { title: "Quad101", server: "101.101.101.101" },
    { title: "NextDNS", server: "45.90.28.136" },
    { title: "Adguard", server: "94.140.14.140" },
  ]);
  return (
    <div className="w-full h-full p-4">
      <div className="w-full h-full flex justify-between items-stretch gap-2">
        <TextArea
          {...inputProps}
          title={`Domain Names\n(Multilines)`}
          className="w-[300px]"
          allowClear
          disabled={isLoading}
        />
        <div className="self-center flex flex-col gap-3">
          <Button
            {...buttonProps}
            type="primary"
            disabled={isLoading || !hosts}
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
