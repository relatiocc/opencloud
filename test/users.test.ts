import { describe, it, expect } from "vitest";
import { OpenCloud } from "../src";
import { makeFetchMock } from "./_utils";
import type {
  User,
  InventoryItemsPage,
  AssetQuotasPage,
  UserThumbnail,
  UserNotificationResponse,
  UserRestrictionsPage,
  UserRestrictionLogsPage,
  GameJoinRestriction,
  UserRestrictionResponse,
} from "../src/types";

const baseUrl = "https://apis.roblox.com";

describe("Users", () => {
  it("GET /users/{id}", async () => {
    const mockUser: User = {
      path: "users/123456789",
      createTime: "2020-01-15T10:30:00.000Z",
      id: "123456789",
      name: "testuser",
      displayName: "Test User",
      about: "This is a test user",
      locale: "en_US",
      premium: true,
      idVerified: true,
      socialNetworkProfiles: {
        twitter: "testuser",
        youtube: "testuseryt",
        visibility: "EVERYONE",
      },
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockUser },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.users.get("123456789");

    expect(result.id).toBe("123456789");
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/users/123456789`,
    );
  });

  it("GET /users/{id}/inventory-items with filters", async () => {
    const mockInventory: InventoryItemsPage = {
      inventoryItems: [
        {
          path: "users/123456789/inventory-items/1",
          assetDetails: {
            assetId: "1001",
            inventoryItemAssetType: "HAT",
            instanceId: "inst-1",
            collectibleDetails: {
              itemId: "item-1",
              instanceId: "inst-1",
              instanceState: "AVAILABLE",
              serialNumber: 42,
            },
          },
          addTime: "2023-01-15T10:30:00.000Z",
        },
        {
          path: "users/123456789/inventory-items/2",
          assetDetails: {
            assetId: "1002",
            inventoryItemAssetType: "CLASSIC_TSHIRT",
            instanceId: "inst-2",
            collectibleDetails: {
              itemId: "item-2",
              instanceId: "inst-2",
              instanceState: "AVAILABLE",
              serialNumber: 100,
            },
          },
          addTime: "2023-02-20T14:45:00.000Z",
        },
      ],
      nextPageToken: "def",
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockInventory },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.users.listInventoryItems("123456789", {
      maxPageSize: 25,
      pageToken: "abc",
      filter: "inventoryItemAssetTypes=HAT,CLASSIC_TSHIRT",
    });

    expect(result.inventoryItems).toHaveLength(2);
    const url = calls[0]?.url.toString();
    expect(url).toBe(
      `${baseUrl}/cloud/v2/users/123456789/inventory-items?maxPageSize=25&pageToken=abc&filter=inventoryItemAssetTypes%3DHAT%2CCLASSIC_TSHIRT`,
    );
  });

  it("GET /users/{id}/asset-quotas", async () => {
    const mockQuotas: AssetQuotasPage = {
      assetQuotas: [
        {
          path: "users/123456789/asset-quotas/1",
          quotaType: "RATE_LIMIT_UPLOAD",
          assetType: "IMAGE",
          usage: 15,
          period: "MONTH",
          usageResetTime: "2024-11-01T00:00:00.000Z",
        },
        {
          path: "users/123456789/asset-quotas/2",
          quotaType: "RATE_LIMIT_UPLOAD",
          assetType: "AUDIO",
          usage: 5,
          period: "DAY",
          usageResetTime: "2024-10-21T00:00:00.000Z",
        },
      ],
      nextPageToken: "quota-token-123",
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockQuotas },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.users.listAssetQuotas("123456789", {
      maxPageSize: 10,
    });

    expect(result.assetQuotas).toHaveLength(2);
    expect(result.assetQuotas[0]?.assetType).toBe("IMAGE");
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/users/123456789/asset-quotas?maxPageSize=10`,
    );
  });

  it("GET /users/{id}:generateThumbnail", async () => {
    const mockThumbnail: UserThumbnail = {
      response: {
        imageUri:
          "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-123456789-420x420-Png-00000000.png",
      },
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockThumbnail },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.users.generateThumbnail("123456789", {
      size: 420,
      format: "PNG",
      shape: "ROUND",
    });

    expect(result.response.imageUri).toBe(
      "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-123456789-420x420-Png-00000000.png",
    );
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/users/123456789:generateThumbnail?size=420&format=PNG&shape=ROUND`,
    );
  });

  it("GET /users/{id}:generateThumbnail with default options", async () => {
    const mockThumbnail: UserThumbnail = {
      response: {
        imageUri:
          "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-987654321-420x420-Png-00000000.png",
      },
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockThumbnail },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.users.generateThumbnail("987654321");

    expect(result.response.imageUri).toContain("AvatarHeadshot");
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/users/987654321:generateThumbnail`,
    );
  });

  it("POST /users/{id}/notifications", async () => {
    const mockNotification: UserNotificationResponse = {
      path: "users/123456789/notifications/5dd7024b-68e3-ac4d-8232-4217f86ca244",
      id: "5dd7024b-68e3-ac4d-8232-4217f86ca244",
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockNotification },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const notificationBody = {
      source: {
        universe: "universes/96623001",
      },
      payload: {
        type: "TYPE_UNSPECIFIED" as const,
        messageId: "5dd7024b-68e3-ac4d-8232-4217f86ca244",
        parameters: {
          key: {
            stringValue: "bronze egg",
          },
        },
        joinExperience: {
          launchData: "Launch Data",
        },
        analyticsData: {
          category: "Bronze egg hatched",
        },
      },
    };

    const result = await openCloud.users.createNotification(
      "123456789",
      notificationBody,
    );

    expect(result.id).toBe("5dd7024b-68e3-ac4d-8232-4217f86ca244");
    expect(result.path).toBe(
      "users/123456789/notifications/5dd7024b-68e3-ac4d-8232-4217f86ca244",
    );
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/users/123456789/notifications`,
    );
    expect(calls[0]?.init?.method).toBe("POST");
    expect(calls[0]?.init?.body).toContain("universes/96623001");
    expect(calls[0]?.init?.body).toContain("bronze egg");
  });

  it("GET /universes/{id}/user-restrictions", async () => {
    const mockResponse: UserRestrictionsPage = {
      userRestrictions: [
        {
          path: "universes/123/user-restrictions/123",
          user: "users/1",
          updateTime: "2023-07-05T12:34:56Z",
          gameJoinRestriction: {
            active: true,
            duration: "3s",
            privateReason: "some private reason",
            displayReason: "some display reason",
            excludeAltAccounts: false,
            startTime: "2023-07-05T12:34:56Z",
            inherited: false
          }
        }
      ],
      nextPageToken: "token123"
    };

    const { fetchMock, calls } = makeFetchMock([{ status: 200, body: mockResponse }]);
    const openCloud = new OpenCloud({ apiKey: "test-api-key", baseUrl, fetchImpl: fetchMock });

    const result = await openCloud.users.listUserRestrictions("123", { maxPageSize: 10 });

    expect(result).toEqual(mockResponse);
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/universes/123/user-restrictions?maxPageSize=10`
    );
  });

  it("GET /universes/{id}/user-restrictions/{userId}", async () => {
    const mockResponse: UserRestrictionResponse = {
      path: "universes/123/user-restrictions/123",
      user: "users/156",
      updateTime: "2023-07-05T12:34:56Z",
      gameJoinRestriction: {
        active: true,
        duration: "3s",
        privateReason: "some private reason",
        displayReason: "some display reason",
        excludeAltAccounts: false,
        startTime: "2023-07-05T12:34:56Z",
        inherited: false
      }
    };

    const { fetchMock, calls } = makeFetchMock([{ status: 200, body: mockResponse }]);
    const openCloud = new OpenCloud({ apiKey: "test-api-key", baseUrl, fetchImpl: fetchMock });

    const result = await openCloud.users.getUserRestriction("123", "1");

    expect(result).toEqual(mockResponse);
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/universes/123/user-restrictions/1`
    );
  });

  it("PATCH /universes/{id}/user-restrictions/{userId} with valid updateMask", async () => {
    const body: GameJoinRestriction = {
      active: true,
      duration: "3s",
      privateReason: "some private reason",
      displayReason: "some display reason",
      excludeAltAccounts: true
    };

    const mockResponse: UserRestrictionResponse = {
      path: "universes/123/user-restrictions/123",
      user: "users/1",
      updateTime: "2023-07-05T12:34:56Z",
      gameJoinRestriction: { ...body, startTime: "2023-07-05T12:34:56Z", inherited: false }
    };

    const { fetchMock, calls } = makeFetchMock([{ status: 200, body: mockResponse }]);
    const openCloud = new OpenCloud({ apiKey: "test-api-key", baseUrl, fetchImpl: fetchMock });

    const result = await openCloud.users.updateUserRestriction("123", "1", body, "game_join_restriction");

    expect(result).toEqual(mockResponse);
    const url = new URL(calls[0]?.url.toString());
    expect(url.pathname).toBe(`/cloud/v2/universes/123/user-restrictions/1`);
    expect(url.searchParams.get("updateMask")).toBe("game_join_restriction");
  });

  it("PATCH /universes/{id}/user-restrictions/{userId} invalid updateMask throws", async () => {
    const body: GameJoinRestriction = {
      active: true,
      duration: "3s",
      privateReason: "some private reason",
      displayReason: "some display reason",
      excludeAltAccounts: true
    };

    const { fetchMock } = makeFetchMock([]);
    const openCloud = new OpenCloud({ apiKey: "test-api-key", baseUrl, fetchImpl: fetchMock });

    await expect(openCloud.users.updateUserRestriction("123", "1", body, "invalid")).rejects.toThrow();
  });

  it("GET /universes/{id}/user-restrictions:listLogs", async () => {
    const mockResponse: UserRestrictionLogsPage = {
      logs: [
        {
          user: "users/156",
          place: "places/456",
          moderator: { robloxUser: "users/156" },
          createTime: "2023-07-05T12:34:56Z",
          startTime: "2023-07-05T12:34:56Z",
          active: true,
          duration: "3s",
          privateReason: "some private reason",
          displayReason: "some display reason",
          excludeAltAccounts: true,
          restrictionType: {
            gameJoinRestriction: {
              active: true,
              duration: "3s",
              privateReason: "some private reason",
              displayReason: "some display reason",
              excludeAltAccounts: true
            }
          }
        }
      ],
      nextPageToken: "def"
    };

    const { fetchMock, calls } = makeFetchMock([{ status: 200, body: mockResponse }]);
    const openCloud = new OpenCloud({ apiKey: "test-api-key", baseUrl, fetchImpl: fetchMock });

    const result = await openCloud.users.listUserRestrictionLogs("123", { maxPageSize: 10 });

    expect(result).toEqual(mockResponse);
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/universes/123/user-restrictions:listLogs?maxPageSize=10`
    );
  });
});
