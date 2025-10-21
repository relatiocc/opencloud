import { HttpClient } from "../http";
import type {
  AssetQuotasPage,
  InventoryItemsPage,
  ListOptions,
  User,
} from "../types";

/**
 * API client for Roblox Users endpoints.
 * Provides methods to retrieve user information, inventory, and asset quotas.
 *
 * @see https://create.roblox.com/docs/cloud/reference/User
 */
export class Users {
  /**
   * Creates a new Users API client.
   *
   * @param http - HTTP client for making API requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves a Roblox user's profile information by user ID.
   *
   * @param userId - The unique user ID (numeric string)
   * @returns Promise resolving to the user's profile data
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the user is not found or other API error occurs
   *
   * @example
   * ```typescript
   * const user = await client.users.get('123456789');
   * console.log(user.displayName); // "John Doe"
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/User#Cloud_GetUser
   */
  async get(userId: string): Promise<User> {
    return this.http.request<User>(`/cloud/v2/users/${userId}`);
  }

  /**
   * Lists items in a user's Roblox inventory with optional filtering.
   * Supports pagination for large inventories.
   *
   * @param userId - The unique user ID (numeric string)
   * @param options - List options including pagination and filtering
   * @param options.maxPageSize - Maximum items per page (default set by API)
   * @param options.pageToken - Token from previous response for next page
   * @param options.filter - Filter expression (e.g., "inventoryItemAssetTypes=HAT,CLASSIC_PANTS,TSHIRT_ACCESSORY")
   * @returns Promise resolving to a page of inventory items
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the user is not found or other API error occurs
   *
   * @example
   * ```typescript
   * // Get first page of inventory
   * const page1 = await client.users.listInventoryItems('123456789', {
   *   maxPageSize: 50
   * });
   *
   * // Get next page
   * const page2 = await client.users.listInventoryItems('123456789', {
   *   pageToken: page1.nextPageToken
   * });
   *
   * // Filter for specific asset types
   * const hats = await client.users.listInventoryItems('123456789', {
   *   filter: "inventoryItemAssetTypes=HAT,CLASSIC_PANTS,TSHIRT_ACCESSORY"
   * });
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/InventoryItem#Cloud_ListInventoryItems
   */
  async listInventoryItems(
    userId: string,
    options: ListOptions & { filter?: string } = {},
  ): Promise<InventoryItemsPage> {
    const searchParams = new URLSearchParams();
    if (options.maxPageSize)
      searchParams.set("maxPageSize", options.maxPageSize.toString());
    if (options.pageToken) searchParams.set("pageToken", options.pageToken);
    if (options.filter) searchParams.set("filter", options.filter);

    return this.http.request<InventoryItemsPage>(
      `/cloud/v2/users/${userId}/inventory-items`,
      {
        method: "GET",
        searchParams,
      },
    );
  }

  /**
   * Lists asset upload and distribution quotas for a user.
   * Quotas track rate limits for operations like uploading assets.
   *
   * @param userId - The unique user ID (numeric string)
   * @param options - List options for pagination
   * @param options.maxPageSize - Maximum items per page (default set by API)
   * @param options.pageToken - Token from previous response for next page
   * @returns Promise resolving to a page of asset quotas
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the user is not found or other API error occurs
   *
   * @example
   * ```typescript
   * const quotas = await client.users.listAssetQuotas('123456789');
   *
   * for (const quota of quotas.assetQuotas) {
   *   console.log(`${quota.assetType}: ${quota.usage} used`);
   *   console.log(`Resets at: ${quota.usageResetTime}`);
   * }
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/AssetQuota#Cloud_ListAssetQuotas
   */
  async listAssetQuotas(
    userId: string,
    options: ListOptions = {},
  ): Promise<AssetQuotasPage> {
    const searchParams = new URLSearchParams();
    if (options.maxPageSize)
      searchParams.set("maxPageSize", options.maxPageSize.toString());
    if (options.pageToken) searchParams.set("pageToken", options.pageToken);

    return this.http.request<AssetQuotasPage>(
      `/cloud/v2/users/${userId}/asset-quotas`,
      {
        method: "GET",
        searchParams,
      },
    );
  }
}
