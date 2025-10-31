import { describe, it, expect } from "vitest";
import { OpenCloud } from "../src";
import { AuthError } from "../src/errors";
import { makeFetchMock } from "./_utils";

describe("Per-request auth override", () => {
  it("should allow creating a client without default auth", () => {
    const client = new OpenCloud();
    expect(client).toBeDefined();
  });

  it("should throw AuthError when no auth is provided", async () => {
    const { fetchMock } = makeFetchMock([
      { status: 200, body: { displayName: "Test User" } },
    ]);

    const client = new OpenCloud({ fetchImpl: fetchMock });

    await expect(client.users.get("123")).rejects.toThrow(AuthError);
    await expect(client.users.get("123")).rejects.toThrow(
      "No authentication provided",
    );
  });

  it("should use OAuth2 token from withAuth()", async () => {
    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: { displayName: "Test User" } },
    ]);

    const client = new OpenCloud({ fetchImpl: fetchMock });
    const scopedClient = client.withAuth({
      kind: "oauth2",
      accessToken: "test-token-123",
    });

    await scopedClient.users.get("123456");

    expect(calls.length).toBe(1);
    const headers = calls[0]?.init?.headers as Headers;
    expect(headers.get("authorization")).toBe("Bearer test-token-123");
    expect(headers.has("x-api-key")).toBe(false);
  });

  it("should use API key from withAuth()", async () => {
    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: { displayName: "Test User" } },
    ]);

    const client = new OpenCloud({ fetchImpl: fetchMock });
    const scopedClient = client.withAuth({
      kind: "apiKey",
      apiKey: "test-api-key-456",
    });

    await scopedClient.users.get("123456");

    expect(calls.length).toBe(1);
    const headers = calls[0]?.init?.headers as Headers;
    expect(headers.get("x-api-key")).toBe("test-api-key-456");
    expect(headers.has("authorization")).toBe(false);
  });

  it("should override default API key with OAuth2 token", async () => {
    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: { displayName: "Test User" } },
    ]);

    const client = new OpenCloud({
      apiKey: "default-key",
      fetchImpl: fetchMock,
    });
    const scopedClient = client.withAuth({
      kind: "oauth2",
      accessToken: "override-token",
    });

    await scopedClient.users.get("123456");

    expect(calls.length).toBe(1);
    const headers = calls[0]?.init?.headers as Headers;
    expect(headers.get("authorization")).toBe("Bearer override-token");
    // The original x-api-key should still be present from default config,
    // but the authorization header takes precedence
    expect(headers.get("x-api-key")).toBe("default-key");
  });

  it("should allow multiple scoped clients from same base client", async () => {
    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: { displayName: "Test User" } },
    ]);

    const client = new OpenCloud({ fetchImpl: fetchMock });

    const user1Client = client.withAuth({
      kind: "oauth2",
      accessToken: "token-1",
    });
    const user2Client = client.withAuth({
      kind: "oauth2",
      accessToken: "token-2",
    });

    await user1Client.users.get("111");
    await user2Client.users.get("222");

    expect(calls.length).toBe(2);

    const headers1 = calls[0]?.init?.headers as Headers;
    expect(headers1.get("authorization")).toBe("Bearer token-1");

    const headers2 = calls[1]?.init?.headers as Headers;
    expect(headers2.get("authorization")).toBe("Bearer token-2");
  });

  it("should work in multi-tenant server scenario", async () => {
    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: { groupMemberships: [] } },
    ]);

    // Simulate a multi-tenant server
    const client = new OpenCloud({ fetchImpl: fetchMock });

    const handleRequest = async (userToken: string) => {
      const userClient = client.withAuth({
        kind: "oauth2",
        accessToken: userToken,
      });
      return await userClient.groups.listGroupMemberships("123456");
    };

    await handleRequest("user-1-token");
    await handleRequest("user-2-token");

    expect(calls.length).toBe(2);

    const headers1 = calls[0]?.init?.headers as Headers;
    expect(headers1.get("authorization")).toBe("Bearer user-1-token");

    const headers2 = calls[1]?.init?.headers as Headers;
    expect(headers2.get("authorization")).toBe("Bearer user-2-token");
  });
});
