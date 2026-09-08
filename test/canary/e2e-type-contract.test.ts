import { expectTypeOf, test } from "vitest";
import type { DnsQueryT } from "../../src/main/dns";
import type { ModeT, ServerT, WindowApi } from "../../src/shared/types";

test("E2E Type Contract: ModeT is strictly union of 'dns' and 'doh'", () => {
  expectTypeOf<ModeT>().toEqualTypeOf<"dns" | "doh">();
});

test("E2E Type Contract: ServerT adheres to required structural schema", () => {
  expectTypeOf<ServerT>().toEqualTypeOf<{
    title: string;
    description: string;
    document: string;
    server: string;
    ip: string;
  }>();

  expectTypeOf<ServerT>().toHaveProperty("title").toBeString();
  expectTypeOf<ServerT>().toHaveProperty("description").toBeString();
  expectTypeOf<ServerT>().toHaveProperty("document").toBeString();
  expectTypeOf<ServerT>().toHaveProperty("server").toBeString();
  expectTypeOf<ServerT>().toHaveProperty("ip").toBeString();
});

test("E2E Type Contract: DnsQueryT matches query parameters structure", () => {
  expectTypeOf<DnsQueryT>().toEqualTypeOf<{
    server: string;
    ip: string;
    name: string;
    type: "A" | "AAAA";
  }>();

  expectTypeOf<DnsQueryT>()
    .toHaveProperty("type")
    .toEqualTypeOf<"A" | "AAAA">();
});

test("E2E Type Contract: WindowApi contract matches preload exposition", () => {
  expectTypeOf<WindowApi["servers"]>().toEqualTypeOf<ServerT[]>();
  expectTypeOf<WindowApi["queryIpv4"]>().toEqualTypeOf<
    (mode: ModeT, name: string) => Promise<string[]>
  >();
  expectTypeOf<WindowApi["queryIpv6"]>().toEqualTypeOf<
    (mode: ModeT, name: string) => Promise<string[]>
  >();
});
