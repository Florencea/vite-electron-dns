import {
  ClearOutlined,
  LoadingOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, Input, Radio, Space, Typography } from "antd";
import { ipcRenderer } from "electron";
import { useState } from "react";

const { TextArea } = Input;
const { Text } = Typography;

const SERVERS = [
  {
    title: "Google Public DNS",
    server: "https://dns.google/resolve",
    ip: "8.8.8.8",
  },
  {
    title: "Cloudflare 1.1.1.1",
    server: "https://cloudflare-dns.com/dns-query",
    ip: "1.1.1.1",
  },
  {
    title: "Quad 101",
    server: "https://dns.twnic.tw/dns-query",
    ip: "101.101.101.101",
  },
  {
    title: "NextDNS",
    server: "https://dns.nextdns.io/dns-query",
    ip: "45.90.28.170",
  },
  {
    title: "OpenDNS",
    server: "-",
    ip: "208.67.222.222",
  },
  {
    title: "Quad9",
    server: "-",
    ip: "9.9.9.9",
  },
  {
    title: "Adguard",
    server: "-",
    ip: "94.140.14.14",
  },
  {
    title: "Hinet",
    server: "-",
    ip: "168.95.192.1",
  },
  {
    title: "System Default",
    server: "-",
    ip: "-",
  },
];

export const Page = () => {
  const [form] = Form.useForm<{ host: string }>();
  const [mode, setMode] = useState<"dns" | "doh">("dns");

  const ipv4 = useMutation({
    mutationFn: async (name: string): Promise<string[]> =>
      ipcRenderer.invoke(mode, "A", name, SERVERS),
  });

  const ipv6 = useMutation({
    mutationFn: async (name: string): Promise<string[]> =>
      ipcRenderer.invoke(mode, "AAAA", name, SERVERS),
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
      <Flex vertical gap={16}>
        <Text style={{ whiteSpace: "pre-wrap" }}>Query mode</Text>
        <Radio.Group
          value={mode}
          optionType="button"
          buttonStyle="solid"
          options={[
            {
              label: "DNS",
              value: "dns",
            },
            {
              label: "DoH",
              value: "doh",
            },
          ]}
          onChange={(e) => {
            setMode(e.target.value);
            form.resetFields();
            form.submit();
          }}
        />
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
      <Flex wrap="wrap" gap={16}>
        {SERVERS.map(({ title, server, ip }, idx) => (
          <Flex style={{ width: "32%" }} key={title} vertical>
            <Text
              style={{ whiteSpace: "pre-wrap" }}
            >{`${title}\n(${mode === "dns" ? ip : server})`}</Text>
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
    </Flex>
  );
};
