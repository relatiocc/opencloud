import { describe, it, expect } from "vitest";
import { OpenCloud } from "../src";
import { makeFetchMock } from "./_utils";
import type {
  User,
  InventoryItemsPage,
  AssetQuotasPage,
  UserThumbnail,
  UserNotificationResponse,
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
});
