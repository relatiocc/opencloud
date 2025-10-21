import { describe, it, expect } from "vitest";
import { OpenCloud } from "../src";
import { makeFetchMock } from "./_utils";
import type { User, InventoryItemsPage, AssetQuotasPage } from "../src/types";

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
});
