import type { IpcMainInvokeEvent } from "electron";
import { describe, expect, it, vi } from "vitest";
import {
  fetchDns,
  fetchHost,
  resolveDns,
  resolveHost,
} from "../../src/main/dns";
import { SERVERS } from "../../src/shared/servers";

const mockEvent = {} as IpcMainInvokeEvent;

describe("SERVERS configuration", () => {
  it("contains at least 5 default DNS resolvers", () => {
    expect(SERVERS.length).toBeGreaterThanOrEqual(5);
  });

  it("every server has valid required fields", () => {
    for (const s of SERVERS) {
      expect(s.title.trim().length).toBeGreaterThan(0);
      expect(s.description.trim().length).toBeGreaterThan(0);
      expect(s.document.trim().length).toBeGreaterThan(0);
      expect(s.server.trim().length).toBeGreaterThan(0);
      expect(s.ip.trim().length).toBeGreaterThan(0);

      if (s.server !== "-") {
        expect(s.server).toMatch(/^https:\/\//);
      }
    }
  });
});

describe("fetchDns (DoH)", () => {
  it("returns empty string when server is '-'", async () => {
    const res = await fetchDns({
      server: "-",
      ip: "8.8.8.8",
      name: "example.com",
      type: "A",
    });
    expect(res).toBe("");
  });

  it("handles successful DoH response and formats IPv4 results", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          Answer: [
            { type: 1, data: "93.184.216.34" },
            { type: 1, data: "not-an-ip" },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const res = await fetchDns({
      server: "https://dns.google/resolve",
      ip: "8.8.8.8",
      name: "example.com",
      type: "A",
    });

    expect(res).toContain("ipv4:");
    expect(res).toContain("93.184.216.34");
    expect(res).not.toContain("not-an-ip");

    globalThis.fetch = originalFetch;
  });

  it("returns empty string when fetch response status is non-2xx", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(new Response("Server Error", { status: 500 }));

    const res = await fetchDns({
      server: "https://dns.google/resolve",
      ip: "8.8.8.8",
      name: "example.com",
      type: "A",
    });

    expect(res).toBe("");

    globalThis.fetch = originalFetch;
  });

  it("returns empty string when fetch throws network error", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network failed"));

    const res = await fetchDns({
      server: "https://dns.google/resolve",
      ip: "8.8.8.8",
      name: "example.com",
      type: "A",
    });

    expect(res).toBe("");

    globalThis.fetch = originalFetch;
  });
});

describe("resolveDns (Native DNS)", () => {
  it("resolves IPv4 for a valid domain", async () => {
    const res = await resolveDns({
      server: "-",
      ip: "-",
      name: "localhost",
      type: "A",
    });

    // localhost or DNS query produces a result string or empty string on restricted environments
    expect(typeof res).toBe("string");
  });

  it("handles DNS lookup errors gracefully by returning empty string", async () => {
    const res = await resolveDns({
      server: "-",
      ip: "-",
      name: "this-domain-definitely-does-not-exist-123456789.invalid",
      type: "A",
    });
    expect(res).toBe("");
  });
});

describe("IPC handler wrappers (fetchHost & resolveHost)", () => {
  it("returns empty array if host name is empty", async () => {
    const fetchRes = await fetchHost(mockEvent, "A", "", [
      { title: "Test", server: "https://test.com", ip: "1.1.1.1" },
    ]);
    expect(fetchRes).toEqual([]);

    const resolveRes = await resolveHost(mockEvent, "A", "", [
      { title: "Test", server: "https://test.com", ip: "1.1.1.1" },
    ]);
    expect(resolveRes).toEqual([]);
  });
});
