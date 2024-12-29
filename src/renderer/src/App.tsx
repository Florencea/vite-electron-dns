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
import { useState } from "react";
import type { ModeT } from "src/preload/index.d";

export const App = () => {
  const [mode, setMode] = useState<ModeT>("dns");

  const ipv4 = useMutation({
    mutationFn: async (name: string) => window.api.queryIpv4(mode, name),
  });

  const ipv6 = useMutation({
    mutationFn: async (name: string) => window.api.queryIpv6(mode, name),
  });

  const isLoading = ipv4.isPending || ipv6.isPending;

  return (
    <Provider locale="en-US" theme={defaultTheme} UNSAFE_className="h-svh">
      <View padding="size-200" paddingTop="size-200">
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
                    setMode(value as ModeT);
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
              {window.api.servers
                .filter((s) => {
                  if (mode === "dns") {
                    return true;
                  } else if (mode === "doh") {
                    return s.server !== "-";
                  } else {
                    return false;
                  }
                })
                .map(({ title, server, ip, description, document }, idx) => (
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
};
