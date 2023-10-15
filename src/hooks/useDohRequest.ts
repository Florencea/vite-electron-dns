import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface DohQueryT {
  url: string;
  name: string;
  type: "A" | "AAAA";
  signal: AbortSignal;
}

interface DohAnswerT {
  Answer: { type: number; data: string }[];
  Comment: string;
  nameServer: string;
}

const useDohRequest = (
  queryKey: string[],
  reqConfigs: Omit<DohQueryT, "signal">[],
  queryOptions?: UseQueryOptions<DohAnswerT[], unknown>,
) =>
  useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      Promise.all(
        reqConfigs.map(({ url, name, type }) =>
          $doh({ url, name, type, signal }),
        ),
      ),
    ...queryOptions,
  });

export const $doh = async (reqConfig: DohQueryT): Promise<DohAnswerT> => {
  const { url, name, type, signal } = reqConfig;
  const fullUrl = new URL(url);
  fullUrl.searchParams.set("name", name);
  fullUrl.searchParams.set("type", `${type}`);
  const res = await fetch(
    new Request(fullUrl, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/dns-json",
      },
    }),
  );
  const data = await res.json();
  return data;
};

export default useDohRequest;
