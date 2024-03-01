import {
  Button,
  ButtonGroup,
  Content,
  ContextualHelp,
  Divider,
  Flex,
  Form,
  Grid,
  Header,
  Heading,
  LabeledValue,
  Link,
  Provider,
  Radio,
  RadioGroup,
  Text,
  TextField,
  View,
  Well,
  defaultTheme,
  minmax,
  repeat,
} from "@adobe/react-spectrum";
import { useMutation } from "@tanstack/react-query";
import { ipcRenderer } from "electron";
import { useState } from "react";

const SERVERS = [
  {
    title: "Google Public DNS",
    description:
      "A free, global DNS resolution service that you can use as an alternative to your current DNS provider.",
    document: "https://developers.google.com/speed/public-dns",
    server: "https://dns.google/resolve",
    ip: "8.8.8.8",
  },
  {
    title: "Cloudflare 1.1.1.1",
    description:
      "A public DNS resolver operated by Cloudflare that offers a fast and private way to browse the Internet.",
    document: "https://1.1.1.1/dns/",
    server: "https://cloudflare-dns.com/dns-query",
    ip: "1.1.1.1",
  },
  {
    title: "Quad 101",
    description:
      "A TWNIC's experimental Public DNS project. TWNIC (Taiwan Network Information Center) is a ccTLD (country-code Top Level Domain) registry operator. TWNIC runs one of the world's fastest DNS infrastructure",
    document: "https://101.101.101.101/index_en.html",
    server: "https://dns.twnic.tw/dns-query",
    ip: "101.101.101.101",
  },
  {
    title: "NextDNS",
    description:
      "A service that allows you to protect your online browsing from unwanted content, malware, and privacy threats.",
    document: "https://nextdns.io/",
    server: "https://dns.nextdns.io/dns-query",
    ip: "45.90.28.170",
  },
  {
    title: "OpenDNS",
    description:
      "An American company providing Domain Name System (DNS) resolution services—with features such as phishing protection, optional content filtering, and DNS lookup in its DNS servers—and a cloud computing security product suite, Umbrella, designed to protect enterprise customers from malware, botnets, phishing, and targeted online attacks.",
    document: "https://www.opendns.com/",
    server: "-",
    ip: "208.67.222.222",
  },
  {
    title: "Quad9",
    description:
      "A free service that replaces your default ISP or enterprise Domain Name Server (DNS) configuration.",
    document: "https://www.quad9.net/",
    server: "-",
    ip: "9.9.9.9",
  },
  {
    title: "Adguard",
    description:
      "A reliable way to block ads on the Internet without installing a mandatory application.",
    document: "https://adguard-dns.io/en/public-dns.html",
    server: "-",
    ip: "94.140.14.14",
  },
  {
    title: "Hinet",
    description: "A public DNS resolver operated by ISP Chunghwa Telecom",
    document: "-",
    server: "-",
    ip: "168.95.192.1",
  },
  {
    title: "System Default",
    description: "DNS provided by your operating system",
    document: "-",
    server: "-",
    ip: "-",
  },
];

export default function App() {
  const [mode, setMode] = useState("dns");

  const ipv4 = useMutation({
    mutationFn: async (name: string): Promise<string[]> =>
      ipcRenderer.invoke(mode, "A", name, SERVERS),
  });

  const ipv6 = useMutation({
    mutationFn: async (name: string): Promise<string[]> =>
      ipcRenderer.invoke(mode, "AAAA", name, SERVERS),
  });

  const isLoading = ipv4.isPending || ipv6.isPending;

  return (
    <Provider theme={defaultTheme}>
      <View height="100svh" padding="size-200">
        <Flex direction="column" gap="size-100">
          <View
            borderWidth="thin"
            borderColor="dark"
            borderRadius="medium"
            padding="size-250"
          >
            <Form
              isDisabled={isLoading}
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const host = formData.get("host")?.toString() ?? "";
                await ipv4.mutateAsync(host);
                await ipv6.mutateAsync(host);
              }}
              onReset={async () => {
                await ipv4.mutateAsync("");
                await ipv6.mutateAsync("");
              }}
            >
              <Flex alignItems="end" gap="size-200">
                <RadioGroup
                  label="Query Mode"
                  name="mode"
                  orientation="horizontal"
                  defaultValue={mode}
                  value={mode}
                  onChange={async (value) => {
                    setMode(value);
                    await ipv4.mutateAsync("");
                    await ipv6.mutateAsync("");
                  }}
                >
                  <Radio value="dns">DNS</Radio>
                  <Radio value="doh">DNS over HTTPS</Radio>
                </RadioGroup>
                <TextField label="Domain" name="host" />
                <ButtonGroup>
                  <Button type="submit" variant="primary" isPending={isLoading}>
                    Submit
                  </Button>
                  <Button type="reset" variant="secondary">
                    Reset
                  </Button>
                </ButtonGroup>
              </Flex>
            </Form>
          </View>
          <View paddingBottom="size-200">
            <Grid
              columns={repeat("auto-fill", minmax("300px", "1fr"))}
              gap="size-200"
            >
              {SERVERS.filter((s) => {
                if (mode === "dns") {
                  return true;
                } else if (mode === "doh") {
                  return s.server !== "-";
                } else {
                  return false;
                }
              }).map(({ title, server, ip, description, document }, idx) => (
                <Well
                  flexShrink={0}
                  key={title}
                  role="region"
                  aria-labelledby={title}
                >
                  <Header>
                    <Flex justifyContent="space-between">
                      <Heading level={1}>{title}</Heading>
                      <ContextualHelp variant="info">
                        <Heading>{title}</Heading>
                        <Content>
                          <Flex direction="column" gap="size-200">
                            <Text>{description}</Text>
                            {document !== "-" && (
                              <Link
                                href={document}
                                target="_blank"
                                rel="noreferer"
                              >
                                Document
                              </Link>
                            )}
                            {ip !== "-" && (
                              <LabeledValue label="DNS" value={ip} />
                            )}
                            {server !== "-" && (
                              <LabeledValue
                                label="DNS over HTTPS"
                                value={server}
                              />
                            )}
                          </Flex>
                        </Content>
                      </ContextualHelp>
                    </Flex>
                  </Header>
                  <Divider marginY="size-100" size="S" />
                  <Content>
                    <code className="whitespace-pre-wrap">
                      {ipv4?.data
                        ? ipv4.data.map((a, idx) =>
                            [a, ipv6?.data?.[idx]].join("\n"),
                          )?.[idx]
                        : ""}
                    </code>
                  </Content>
                </Well>
              ))}
            </Grid>
          </View>
        </Flex>
      </View>
    </Provider>
  );
}
