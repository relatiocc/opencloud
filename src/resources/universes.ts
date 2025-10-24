import { HttpClient } from "../http";
import { ListOptions } from "../types";
import {
  Universe,
  UniverseBody,
  UserRestrictionPage,
} from "../types/universes";
import { buildFieldMask } from "../utils/fieldMask";

/**
 * API client for Roblox universe endpoints.
 * Provides methods to retrieve universe information, shouts, and universe memberships.
 *
 * @see https://create.roblox.com/docs/cloud/reference/Universe
 */
export class Universes {
  /**
   * Creates a new Universes API client.
   *
   * @param http - HTTP client for making API requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves a universes information by universe ID.
   *
   * @param universeId - The unique universe ID (numeric string)
   * @returns Promise resolving to the universes's data
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the universe is not found or other API error occurs
   *
   * @example
   * ```typescript
   * const universe = await client.universes.get('123456789');
   * console.log(universe.displayName); // "Roblox"
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/universe#Cloud_Getuniverse
   */
  async get(universeId: string): Promise<Universe> {
    return this.http.request<Universe>(`/cloud/v2/universes/${universeId}`);
  }

  /**
   * Updates universe by universe ID.
   *
   * @param universeId - The unique universe ID (numeric string)
   * @param body - The universe data to update
   * @returns Promise resolving to the updated universe's data
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the universe is not found or other API error occurs
   * * @example
   * ```typescript
   * const updatedUniverse = await client.universes.update('123456789', {
   *   voiceChatEnabled: true,
   *   desktopEnabled: true
   * });
   * console.log(updatedUniverse.voiceChatEnabled); // "true"
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/universe#Cloud_UpdateUniverse
   */
  async update(universeId: string, body: UniverseBody): Promise<Universe> {
    const searchParams = new URLSearchParams();

    const fieldMask = buildFieldMask<UniverseBody>(body);
    searchParams.append("updateMask", fieldMask);

    return this.http.request<Universe>(`/cloud/v2/universes/${universeId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
      searchParams,
    });
  }

  /**
   * List user restrictions for users that have ever been banned in either a universe or a specific place.
   *
   * @param universeId - The unique universe ID (numeric string)
   * @param options - List options for pagination
   * @param options.maxPageSize - Maximum items per page (default set by API)
   * @param options.pageToken - Token from previous response for next page
   * @returns Promise resolving to a page of user restrictions
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the universe is not found or other API error occurs
   *
   * @example
   * ```typescript
   * const userRestrictions = await client.universes.listUserRestrictions('123456789');
   * console.log(userRestrictions);
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/UserRestriction#Cloud_ListUserRestrictions__Using_Universes
   */
  async listUserRestrictions(
    universeId: string,
    options: ListOptions = {},
  ): Promise<UserRestrictionPage> {
    const searchParams = new URLSearchParams();
    if (options.maxPageSize)
      searchParams.append("maxPageSize", options.maxPageSize.toString());
    if (options.pageToken) searchParams.append("pageToken", options.pageToken);

    return this.http.request<UserRestrictionPage>(
      `/cloud/v2/universes/${universeId}/user-restrictions`,
      {
        method: "GET",
        searchParams,
      },
    );
  }
}
