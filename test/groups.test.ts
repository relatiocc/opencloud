import { describe, it, expect } from "vitest";
import { OpenCloud } from "../src";
import { makeFetchMock } from "./_utils";
import type {
  Group,
  GroupMembershipItemsPage,
  JoinRequestItemsPage,
} from "../src/types";

const baseUrl = "https://apis.roblox.com";

describe("Groups", () => {
  it("GET /groups/{id}", async () => {
    const mockGroup: Group = {
      path: "groups/123456789",
      createTime: "2020-01-15T10:30:00.000Z",
      updateTime: "2024-10-15T12:00:00.000Z",
      id: "123456789",
      displayName: "Test Group",
      description: "This is a test group for unit testing",
      owner: "users/987654321",
      memberCount: 150,
      publicEntryAllowed: true,
      locked: false,
      verified: true,
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockGroup },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.groups.get("123456789");

    expect(result.id).toBe("123456789");
    expect(result.displayName).toBe("Test Group");
    expect(result.memberCount).toBe(150);
    expect(result.verified).toBe(true);
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/groups/123456789`,
    );
  });

  it("GET /groups/{id}/join-requests without options", async () => {
    const mockJoinRequests: JoinRequestItemsPage = {
      groupJoinRequests: [
        {
          path: "groups/123456789/join-requests/1",
          createTime: "2024-10-10T08:00:00.000Z",
          user: "users/111111111",
        },
        {
          path: "groups/123456789/join-requests/2",
          createTime: "2024-10-11T09:15:00.000Z",
          user: "users/222222222",
        },
      ],
      nextPageToken: "join-token-123",
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockJoinRequests },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.groups.listGroupJoinRequests("123456789");

    expect(result.groupJoinRequests).toHaveLength(2);
    expect(result.groupJoinRequests[0]?.user).toBe("users/111111111");
    expect(result.nextPageToken).toBe("join-token-123");
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/groups/123456789/join-requests`,
    );
  });

  it("GET /groups/{id}/join-requests with pagination", async () => {
    const mockJoinRequests: JoinRequestItemsPage = {
      groupJoinRequests: [
        {
          path: "groups/123456789/join-requests/3",
          createTime: "2024-10-12T10:30:00.000Z",
          user: "users/333333333",
        },
      ],
      nextPageToken: "join-token-456",
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockJoinRequests },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.groups.listGroupJoinRequests("123456789", {
      maxPageSize: 50,
      pageToken: "previous-token",
    });

    expect(result.groupJoinRequests).toHaveLength(1);
    const url = calls[0]?.url.toString();
    expect(url).toBe(
      `${baseUrl}/cloud/v2/groups/123456789/join-requests?maxPageSize=50&pageToken=previous-token`,
    );
  });

  it("GET /groups/{id}/join-requests with filter", async () => {
    const mockJoinRequests: JoinRequestItemsPage = {
      groupJoinRequests: [
        {
          path: "groups/123456789/join-requests/1",
          createTime: "2024-10-10T08:00:00.000Z",
          user: "users/156",
        },
      ],
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockJoinRequests },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.groups.listGroupJoinRequests("123456789", {
      filter: "user == 'users/156'",
    });

    expect(result.groupJoinRequests).toHaveLength(1);
    expect(result.groupJoinRequests[0]?.user).toBe("users/156");
    const url = calls[0]?.url.toString();
    expect(url).toBe(
      `${baseUrl}/cloud/v2/groups/123456789/join-requests?filter=user+%3D%3D+%27users%2F156%27`,
    );
  });

  it("GET /groups/{id}/join-requests with all options", async () => {
    const mockJoinRequests: JoinRequestItemsPage = {
      groupJoinRequests: [],
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockJoinRequests },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.groups.listGroupJoinRequests("123456789", {
      maxPageSize: 25,
      pageToken: "token-abc",
      filter: "user == 'users/999'",
    });

    expect(result.groupJoinRequests).toHaveLength(0);
    const url = calls[0]?.url.toString();
    expect(url).toBe(
      `${baseUrl}/cloud/v2/groups/123456789/join-requests?maxPageSize=25&pageToken=token-abc&filter=user+%3D%3D+%27users%2F999%27`,
    );
  });

  it("GET /groups/{id}/memberships without options", async () => {
    const mockMemberships: GroupMembershipItemsPage = {
      groupMemberships: [
        {
          path: "groups/123456789/memberships/1",
          createTime: "2020-01-15T10:30:00.000Z",
          updateTime: "2024-01-15T10:30:00.000Z",
          user: "users/111111111",
          role: "groups/123456789/roles/12345",
        },
        {
          path: "groups/123456789/memberships/2",
          createTime: "2020-02-20T14:45:00.000Z",
          updateTime: "2023-05-10T09:20:00.000Z",
          user: "users/222222222",
          role: "groups/123456789/roles/67890",
        },
        {
          path: "groups/123456789/memberships/3",
          createTime: "2020-03-10T08:15:00.000Z",
          updateTime: "2024-10-01T16:00:00.000Z",
          user: "users/333333333",
          role: "groups/123456789/roles/11111",
        },
      ],
      nextPageToken: "membership-token-xyz",
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockMemberships },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.groups.listGroupMemberships("123456789");

    expect(result.groupMemberships).toHaveLength(3);
    expect(result.groupMemberships[0]?.user).toBe("users/111111111");
    expect(result.groupMemberships[1]?.role).toBe(
      "groups/123456789/roles/67890",
    );
    expect(result.nextPageToken).toBe("membership-token-xyz");
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/groups/123456789/memberships`,
    );
  });

  it("GET /groups/{id}/memberships with pagination", async () => {
    const mockMemberships: GroupMembershipItemsPage = {
      groupMemberships: [
        {
          path: "groups/123456789/memberships/4",
          createTime: "2021-06-15T12:00:00.000Z",
          updateTime: "2024-06-15T12:00:00.000Z",
          user: "users/444444444",
          role: "groups/123456789/roles/22222",
        },
      ],
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockMemberships },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.groups.listGroupMemberships("123456789", {
      maxPageSize: 100,
      pageToken: "next-page-token",
    });

    expect(result.groupMemberships).toHaveLength(1);
    expect(result.groupMemberships[0]?.user).toBe("users/444444444");
    const url = calls[0]?.url.toString();
    expect(url).toBe(
      `${baseUrl}/cloud/v2/groups/123456789/memberships?maxPageSize=100&pageToken=next-page-token`,
    );
  });
});
