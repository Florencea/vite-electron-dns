import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { App } from "../../src/renderer/App";
import type { ModeT, ServerT } from "../../src/shared/types";

type QueryFn = (mode: ModeT, name: string) => Promise<string[]>;

const mockServers: ServerT[] = [
  {
    title: "Google Public DNS",
    description: "Google DNS resolver",
    document: "https://developers.google.com/speed/public-dns",
    server: "https://dns.google/resolve",
    ip: "8.8.8.8",
  },
  {
    title: "Pure DNS Provider",
    description: "Legacy DNS without DoH",
    document: "-",
    server: "-",
    ip: "1.2.3.4",
  },
];

const renderComponent = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return await render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
};

describe("<App /> in Browser Mode", () => {
  let queryIpv4Mock: Mock<QueryFn>;
  let queryIpv6Mock: Mock<QueryFn>;

  beforeEach(() => {
    queryIpv4Mock = vi.fn<QueryFn>().mockResolvedValue(["ipv4: 12.34ms\n93.184.216.34"]);
    queryIpv6Mock = vi
      .fn<QueryFn>()
      .mockResolvedValue(["ipv6: 15.67ms\n2606:2800:220:1:248:1893:25c8:1946"]);

    window.api = {
      servers: mockServers,
      queryIpv4: queryIpv4Mock,
      queryIpv6: queryIpv6Mock,
    };
  });

  it("renders server cards in default DNS mode", async () => {
    const screen = await renderComponent();

    const googleHeading = screen.getByRole("heading", {
      name: "Google Public DNS",
      level: 1,
    });
    const pureDnsHeading = screen.getByRole("heading", {
      name: "Pure DNS Provider",
      level: 1,
    });

    await expect.element(googleHeading).toBeInTheDocument();
    await expect.element(googleHeading).toBeVisible();
    await expect.element(pureDnsHeading).toBeInTheDocument();
    await expect.element(pureDnsHeading).toBeVisible();
  });

  it("filters out non-DoH servers when switching mode to 'DNS over HTTPS'", async () => {
    const screen = await renderComponent();

    const pureDnsHeading = screen.getByRole("heading", {
      name: "Pure DNS Provider",
      level: 1,
    });
    await expect.element(pureDnsHeading).toBeInTheDocument();

    // Click on the 'DNS over HTTPS' radio option
    const dohRadio = screen.getByRole("radio", { name: /DNS over HTTPS/i });
    await dohRadio.click();

    // Google Public DNS should remain visible
    const googleHeading = screen.getByRole("heading", {
      name: "Google Public DNS",
      level: 1,
    });
    await expect.element(googleHeading).toBeInTheDocument();

    // Pure DNS Provider should be filtered out
    await expect.element(pureDnsHeading).not.toBeInTheDocument();
  });

  it("triggers queries upon domain form submission", async () => {
    const screen = await renderComponent();

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await expect.element(submitBtn).toBeVisible();

    const domainInput = screen.getByRole("textbox", { name: /domain/i });
    await domainInput.fill("example.com");

    await submitBtn.click();

    expect(queryIpv4Mock).toHaveBeenCalledWith("dns", "example.com");
    expect(queryIpv6Mock).toHaveBeenCalledWith("dns", "example.com");
  });

  it("clears results when clicking Reset", async () => {
    const screen = await renderComponent();

    const resetBtn = screen.getByRole("button", { name: /reset/i });
    await expect.element(resetBtn).toBeVisible();

    await resetBtn.click();

    expect(queryIpv4Mock).toHaveBeenCalledWith("dns", "");
    expect(queryIpv6Mock).toHaveBeenCalledWith("dns", "");
  });
});
