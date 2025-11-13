import { HttpClient } from "../http";
import type {
  AssetQuotasPage,
  GenerateThumbnailOptions,
  InventoryItemsPage,
  ListOptions,
  User,
  UserNotificationBody,
  UserNotificationResponse,
  UserThumbnail,
} from "../types";

/**
 * API client for Roblox Users endpoints.
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
   * Generates and returns the URL for the user's avatar thumbnail.
   *
   * @param userId - The unique user ID (numeric string)
   * @param options - Options for thumbnail generation
   * @param options.size - Size of the thumbnail (supported values: 48, 50, 60, 75, 100, 110, 150, 180, 352, 420, 720 Default is 420)
   * @param options.format - Format of the thumbnail
   * @param options.shape - Shape of the thumbnail
   * @returns Promise resolving to the user's thumbnail data
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the user is not found or other API error occurs
   *
   * @example
   * ```typescript
   * const thumbnail = await client.users.generateThumbnail('123456789', {
   *   size: 100,
   *   format: 'PNG',
   *   shape: 'ROUND'
   * });
   * console.log(thumbnail.response.imageUri);
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/User#Cloud_GenerateUserThumbnail
   */
  async generateThumbnail(
    userId: string,
    options: GenerateThumbnailOptions = {},
  ): Promise<UserThumbnail> {
    const searchParams = new URLSearchParams();
    if (options.size) searchParams.set("size", options.size.toString());
    if (options.format) searchParams.set("format", options.format);
    if (options.shape) searchParams.set("shape", options.shape);

    return this.http.request<UserThumbnail>(
      `/cloud/v2/users/${userId}:generateThumbnail`,
      {
        method: "GET",
        searchParams,
      },
    );
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

  /**
   * Sends a notification to a user.
   *
   * @param userId - The unique user ID (numeric string)
   * @param body - The notification body containing source and payload
   * @returns Promise resolving to the notification response
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the user is not found or other API error occurs
   *
   * @example
   * ```typescript
   * const notification = await client.users.createNotification('123456789', {
   *   source: {
   *     universe: 'universes/96623001'
   *   },
   *   payload: {
   *     type: "TYPE_UNSPECIFIED",
   *     messageId: "5dd7024b-68e3-ac4d-8232-4217f86ca244",
   *     parameters: {
   *       key: {
   *         stringValue: "bronze egg"
   *       }
   *     },
   *     joinExperience: {
   *       launchData: "Launch Data"
   *     },
   *     analyticsData: {
   *       category: "Bronze egg hatched"
   *     }
   *   }
   * });
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/UserNotification#Cloud_CreateUserNotification
   */
  async createNotification(
    userId: string,
    body: UserNotificationBody,
  ): Promise<UserNotificationResponse> {
    return this.http.request<UserNotificationResponse>(
      `/cloud/v2/users/${userId}/notifications`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  }
}
