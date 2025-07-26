import { contextBridge, ipcRenderer } from "electron";
import type { ModeT, ServerT } from "./index.d";

const SERVERS: ServerT[] = [
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
    title: "Hinet 1",
    description:
      "A public DNS resolver operated by ISP Chunghwa Telecom (dns.hinet.net)",
    document: "-",
    server: "-",
    ip: "168.95.1.1",
  },
  {
    title: "Hinet 2",
    description:
      "A public DNS resolver operated by ISP Chunghwa Telecom (hntp1.hinet.net)",
    document: "-",
    server: "-",
    ip: "168.95.192.1",
  },
  {
    title: "AliDNS",
    description: "A public DNS resolver operated by Alibaba Cloud (AliDNS)",
    document: "https://www.alidns.com/",
    server: "-",
    ip: "223.5.5.5",
  },
  {
    title: "BaiduDNS",
    description: "A public DNS resolver operated by Baidu (BaiduDNS)",
    document: "https://dudns.baidu.com/",
    server: "-",
    ip: "180.76.76.76",
  },
  {
    title: "System Default",
    description: "DNS provided by your operating system",
    document: "-",
    server: "-",
    ip: "-",
  },
];

const api = {
  servers: SERVERS,
  queryIpv4: (mode: ModeT, name: string) =>
    ipcRenderer.invoke(mode, "A", name, SERVERS),
  queryIpv6: (mode: ModeT, name: string) =>
    ipcRenderer.invoke(mode, "AAAA", name, SERVERS),
};

try {
  contextBridge.exposeInMainWorld("api", api);
  // for process.env.CHROMATIC code in react spectrum
  const fakeProcess = { env: { CHROMATIC: false } };
  contextBridge.exposeInMainWorld("process", fakeProcess);
} catch (error) {
  console.error(error);
}
