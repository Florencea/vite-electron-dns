import {
  ClearOutlined,
  LoadingOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { App, Button, Form, Input, Typography } from "antd";

const { TextArea } = Input;
const { Text } = Typography;

interface DnsQueryT {
  server: string;
  name: string;
  type: "A" | "AAAA";
}

interface AnsT {
  Answer: { type: number; data: string }[];
  Comment: string;
  nameServer: string;
}

const SERVERS = [
  { title: "Google Public DNS", server: "https://dns.google/resolve" },
  {
    title: "Cloudflare 1.1.1.1",
    server: "https://cloudflare-dns.com/dns-query",
  },
];

const fetchDns = async ({ server, name, type }: DnsQueryT): Promise<string> => {
  const url = new URL(server);
  url.searchParams.set("name", name);
  url.searchParams.set("type", type);
  const res = await fetch(
    new Request(url, {
      method: "GET",
      headers: {
        Accept: "application/dns-json",
      },
    }),
  );
  if (!(res.status >= 200 && res.status < 300)) {
    throw new Error(`Request failed on status ${res.status}`);
  }
  const ans: AnsT = await res.json();
  const data = ans?.Answer?.map((d) => d.data)?.join("\n");
  return data;
};

const fetchHost = (type: "A" | "AAAA", name: string) =>
  name
    ? Promise.all(SERVERS.map(({ server }) => fetchDns({ server, name, type })))
    : Promise.resolve([]);

export const Doh = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm<{ host: string }>();

  const ipv4 = useMutation({
    mutationFn: (name: string) => fetchHost("A", name),
    onError: (err) => {
      message.error({
        content: `ipv4: ${err.message}`,
      });
    },
  });

  const ipv6 = useMutation({
    mutationFn: (name: string) => fetchHost("AAAA", name),
    onError: (err) => {
      message.error({
        content: `ipv6: ${err.message}`,
      });
    },
  });

  const isLoading = ipv4.isPending || ipv6.isPending;

  const host = Form.useWatch("host", form);

  return (
    <div className="w-full h-svh p-4">
      <div className="w-full h-full flex justify-between items-stretch gap-2">
        <div className="flex flex-col">
          <Text className="whitespace-pre-wrap">{`Domain Name\n(Press Enter to submit)`}</Text>
          <Form
            form={form}
            initialValues={{ host: "" }}
            onFinish={async (values: { host: string }) => {
              await ipv4.mutateAsync(values.host);
              await ipv6.mutateAsync(values.host);
            }}
          >
            <Form.Item name="host" noStyle>
              <Input
                autoFocus
                className="w-[300px]"
                size="middle"
                disabled={isLoading}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="self-center flex flex-col gap-3">
          <Button
            type="primary"
            disabled={isLoading || !host}
            onClick={() => {
              form.submit();
            }}
          >
            {isLoading ? <LoadingOutlined /> : <SwapRightOutlined />}
          </Button>
          <Button
            danger
            disabled={isLoading}
            onClick={() => {
              form.resetFields();
              form.submit();
            }}
          >
            <ClearOutlined />
          </Button>
        </div>
        {SERVERS.map(({ title, server }, idx) => (
          <div key={server} className="flex flex-col grow">
            <Text className="whitespace-pre-wrap">{`${title}\n(${server})`}</Text>
            <div className="flex grow">
              <TextArea
                className="self-stretch grow h-full"
                value={
                  ipv4?.data
                    ? ipv4.data.map((a, idx) =>
                        [a, ipv6?.data?.[idx]].join("\n"),
                      )?.[idx]
                    : ""
                }
                readOnly
                disabled={isLoading}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
