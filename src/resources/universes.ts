import { HttpClient } from "../http";
import { ListOptions } from "../types";
import {
  GameJoinRestriction,
  PublishMessageBody,
  SpeechAssetBody,
  SpeechAssetOperation,
  SpeechAssetResponse,
  TranslateTextBody,
  TranslateTextResponse,
  Universe,
  UniverseBody,
  UserRestriction,
  UserRestrictionLogPage,
  UserRestrictionPage,
} from "../types";
import { buildFieldMask } from "../utils/fieldMask";
import { generateIdempotencyKey } from "../utils/idempotency";

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

  /**
   * Get the user restriction.
   *
   * *Requires `universe.user-restriction:read` scope.*
   *
   * @param universeId - The universe ID. (numeric string)
   * @param userRestrictionId - The user ID. (numeric string)
   * @returns Promise resolving to the user restriction response
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If an API error occurs
   *
   * @example
   * ```typescript
   * const userRestriction = await client.users.getUserRestriction('123456789', '123456789');
   * console.log(userRestriction);
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/UserRestriction#Cloud_UpdateUserRestriction__Using_Universes_Places
   */
  async getUserRestriction(
    universeId: string,
    userRestrictionId: string,
  ): Promise<UserRestriction> {
    return this.http.request<UserRestriction>(
      `/cloud/v2/universes/${universeId}/user-restrictions/${userRestrictionId}`,
      {
        method: "GET",
      },
    );
  }

  /**
   * Update the user restriction.
   *
   * *Requires `universe.user-restriction:write` scope.*
   *
   * @param universeId - The universe ID (numeric string)
   * @param userRestrictionId - The user ID (numeric string)
   * @param body - The user restriction data to update
   * @returns Promise resolving to the user restriction response
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If an API error occurs
   *
   * @example
   * ```typescript
   * const userRestrction = await client.users.updateUserRestriction('123456789', '123456789', {
   *   active: true,
   *   duration: "3s",
   *   privateReason: "some private reason",
   *   displayReason: "some display reason",
   *   excludeAltAccounts: true
   * });
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/UserRestriction#Cloud_UpdateUserRestriction__Using_Universes_Places
   */
  async updateUserRestriction(
    universeId: string,
    userRestrictionId: string,
    body: GameJoinRestriction,
  ): Promise<UserRestriction> {
    const searchParams = new URLSearchParams();

    searchParams.append("updateMask", "game_join_restriction");

    const idempotencyKey = generateIdempotencyKey();
    const firstSent = new Date().toISOString();

    searchParams.append("idempotencyKey.key", idempotencyKey);
    searchParams.append("idempotencyKey.firstSent", firstSent);

    return this.http.request<UserRestriction>(
      `/cloud/v2/universes/${universeId}/user-restrictions/${userRestrictionId}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
        searchParams,
      },
    );
  }

  /**
   * List changes to UserRestriction resources within a given universe. This includes both universe-level and place-level restrictions.
   * For universe-level restriction logs, the place field will be empty.
   *
   * *Requires `universe.user-restriction:read` scope.*
   *
   * @param universeId - The universe ID (numeric string)
   * @param options - List options including pagination and filtering
   * @param options.maxPageSize - Maximum items per page (default set by API)
   * @param options.pageToken - Token from previous response for next page
   * @param options.filter - Filter expression (e.g., "user == 'users/123'" && "place == 'places/456'")
   * @returns Promise resolving to the user restriction response
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the universeId is invalid or other API error occurs
   *
   * @example
   * ```typescript
   * const userRestriction = await client.users.listUserRestrictions('123456789', {
   *   maxPageSize: 50,
   *   filter: `"user == 'users/123'" && "place == 'places/456'"`
   * });
   * console.log(userRestriction);
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/UserRestriction#Cloud_UpdateUserRestriction__Using_Universes_Places
   */
  async listUserRestrictionLogs(
    universeId: string,
    options: ListOptions & { filter?: string } = {},
  ): Promise<UserRestrictionLogPage> {
    const searchParams = new URLSearchParams();
    if (options.maxPageSize)
      searchParams.set("maxPageSize", options.maxPageSize.toString());
    if (options.pageToken) searchParams.set("pageToken", options.pageToken);
    if (options.filter) searchParams.set("filter", options.filter);

    return this.http.request<UserRestrictionLogPage>(
      `/cloud/v2/universes/${universeId}/user-restrictions:listLogs`,
      {
        method: "GET",
        searchParams,
      },
    );
  }

  async generateSpeechAsset(universeId: string, body: SpeechAssetBody) {
    const speechOperation = await this.http.request<SpeechAssetOperation>(
      `/cloud/v2/universes/${universeId}:generateSpeechAsset`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );

    return this.http.request<SpeechAssetResponse>(
      `/assets/v1/${speechOperation.path}`,
    );
  }

  async publishMessage(
    universeId: string,
    body: PublishMessageBody,
  ): Promise<void> {
    return this.http.request<void>(
      `/cloud/v2/universes/${universeId}:publishMessage`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  }

  /**
   * Restarts all active servers for a specific universe if and only if a new version of the experience has been published.
   * Used for releasing experience updates.
   *
   * @param universeId The universe ID (numeric string)
   * @returns Promise resolving to void
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the universeId is invalid or other API error occurs
   *
   * @example
   * ```typescript
   * await client.universes.restartUniverseServers('123456789');
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/Universe#Cloud_RestartUniverseServers
   */
  async restartUniverseServers(universeId: string): Promise<void> {
    return this.http.request<void>(
      `/cloud/v2/universes/${universeId}:restartServers`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
    );
  }
  async translateText(
    universeId: string,
    body: TranslateTextBody,
  ): Promise<TranslateTextResponse> {
    return this.http.request<TranslateTextResponse>(
      `/cloud/v2/universes/${universeId}:translateText`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  }
}
