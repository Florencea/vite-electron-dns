import { Button } from "antd";
import { Input } from "../components/Input";
import { TextArea } from "../components/TextArea";
import useDoh from "../hooks/useDoh";

export default function Doh() {
  const {
    btnSubmitProps,
    btnClearProps,
    inputProps,
    servers,
    results,
    isLoading,
  } = useDoh([
    { title: "Google Public DNS", server: "https://dns.google/resolve" },
    {
      title: "Cloudflare 1.1.1.1",
      server: "https://cloudflare-dns.com/dns-query",
    },
  ]);
  return (
    <div className="w-full h-full p-4">
      <div className="w-full h-full flex justify-between items-stretch gap-2">
        <Input {...inputProps} />
        <div className="self-center flex flex-col gap-3">
          <Button {...btnSubmitProps} />
          <Button {...btnClearProps} />
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
