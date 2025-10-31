import { describe, it, expect } from "vitest";
import { HttpClient } from "../src/http";
import { AuthError, RateLimitError, OpenCloudError } from "../src";
import { makeFetchMock } from "./_utils";

const baseUrl = "https://apis.roblox.com";

describe("HttpClient", () => {
  it("returns parsed JSON on 200", async () => {
    const { fetchMock } = makeFetchMock([{ status: 200, body: { ok: true } }]);
    const http = new HttpClient({
      baseUrl,
      fetchImpl: fetchMock,
      headers: { "x-api-key": "test-key" },
    });

    const response = await http.request<{ ok: boolean }>("/cloud/v2/ping");
    expect(response.ok).toBe(true);
  });

  it("adds headers and supports searchParams", async () => {
    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: { ok: true } },
    ]);
    const http = new HttpClient({
      baseUrl,
      fetchImpl: fetchMock,
      headers: {
        "x-api-key": "test-api-key",
        "user-agent": "test-agent",
      },
    });

    await http.request("/cloud/v2/users/123", {
      method: "GET",
      searchParams: new URLSearchParams({
        maxPageSize: "25",
        pageToken: "abc",
      }),
    });

    expect(calls.length).toBe(1);
    const url = calls[0]?.url;
    expect(url?.toString()).toBe(
      `${baseUrl}/cloud/v2/users/123?maxPageSize=25&pageToken=abc`,
    );
  });

  it("retries on 500 and then succeeds", async () => {
    const { fetchMock } = makeFetchMock([
      { status: 500, body: { message: "boom" } },
      { status: 500, body: { message: "boom2" } },
      { status: 200, body: { ok: true } },
    ]);

    const http = new HttpClient({
      baseUrl,
      fetchImpl: fetchMock,
      headers: { "x-api-key": "test-key" },
      retry: { attempts: 3, backoff: "fixed", baseMs: 0 }, // make retry instant for test
    });

    const res = await http.request<{ ok: boolean }>("/cloud/v2/ping");
    expect(res.ok).toBe(true);
  });

  it("throws RateLimitError after exhausting 429 retries", async () => {
    const { fetchMock } = makeFetchMock(() => ({
      status: 429,
      headers: { "x-ratelimit-reset": "0" },
    }));

    const http = new HttpClient({
      baseUrl,
      fetchImpl: fetchMock,
      headers: { "x-api-key": "test-key" },
      retry: { attempts: 1, backoff: "fixed", baseMs: 0 },
    });

    await expect(http.request("/cloud/v2/ping")).rejects.toBeInstanceOf(
      RateLimitError,
    );
  });

  it("throws AuthError on 401/403", async () => {
    for (const status of [401, 403]) {
      const { fetchMock } = makeFetchMock([{ status }]);
      const http = new HttpClient({
        baseUrl,
        fetchImpl: fetchMock,
      });
      await expect(http.request("/cloud/v2/secret")).rejects.toBeInstanceOf(
        AuthError,
      );
    }
  });

  it("throws OpenCloudError on other non-retriable errors", async () => {
    const { fetchMock } = makeFetchMock([
      { status: 404, body: { message: "not found", code: "not_found" } },
    ]);
    const http = new HttpClient({
      baseUrl,
      fetchImpl: fetchMock,
    });

    await expect(http.request("/cloud/v2/missing")).rejects.toBeInstanceOf(
      OpenCloudError,
    );
  });
});
