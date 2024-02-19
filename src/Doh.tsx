import {
  ClearOutlined,
  LoadingOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { App, Button, Flex, Form, Input, Space, Typography } from "antd";

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
    <Flex
      style={{
        width: "100%",
        height: "100svh",
        padding: 16,
        boxSizing: "border-box",
      }}
      justify="space-between"
      align="stretch"
      gap={16}
    >
      <Flex vertical>
        <Text
          style={{ whiteSpace: "pre-wrap" }}
        >{`Domain Name\n(Press Enter to submit)`}</Text>
        <Form
          form={form}
          initialValues={{ host: "" }}
          onFinish={async (values: { host: string }) => {
            await ipv4.mutateAsync(values.host);
            await ipv6.mutateAsync(values.host);
          }}
        >
          <Form.Item name="host" noStyle>
            <Input style={{ width: 300 }} autoFocus disabled={isLoading} />
          </Form.Item>
        </Form>
      </Flex>
      <Space style={{ alignSelf: "center" }} direction="vertical">
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
      </Space>
      {SERVERS.map(({ title, server }, idx) => (
        <Flex style={{ flexGrow: 1 }} key={server} vertical>
          <Text
            style={{ whiteSpace: "pre-wrap" }}
          >{`${title}\n(${server})`}</Text>
          <TextArea
            style={{ flexGrow: 1 }}
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
        </Flex>
      ))}
    </Flex>
  );
};
