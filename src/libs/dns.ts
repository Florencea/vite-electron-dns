import { promises } from "node:dns";

export const getDnsResults = async ({
  hosts,
  server,
}: {
  hosts: string;
  server: string;
}) => {
  const hostsArr = hosts.split("\n");
  const resolver = new promises.Resolver();
  resolver.setServers([server]);
  const results = await Promise.all(
    hostsArr.map(async (host) => {
      const address = await resolver.resolve4(host);
      return address?.[0] ?? "";
    }),
  );
  const resultsStr = results.join("\n");
  return resultsStr;
};
