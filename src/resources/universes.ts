import { HttpClient } from "../http";
import { ListOptions, UpdateUserRestrictionOptions } from "../types";
import {
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
 *
 * @see https://create.roblox.com/docs/cloud/reference/Universe
 */
export class Universes {
  /**
   * Creates a new Universes API client.
   *
   * @param http - HTTP client for making API requests
   */
  constructor(private http: HttpClient) { }

  /**
   * Retrieves a universe's information by universe ID.
   *
   * @param universeId - The unique universe ID (numeric string)
   * @returns Promise resolving to the universe's data
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
   *
   * @example
   * ```typescript
   * const updatedUniverse = await client.universes.update('123456789', {
   *   voiceChatEnabled: true,
   *   desktopEnabled: true
   * });
   * console.log(updatedUniverse.voiceChatEnabled); // true
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/universe#Cloud_UpdateUniverse
   */
  async update(universeId: string, body: UniverseBody): Promise<Universe> {
    const searchParams = new URLSearchParams();

    const fieldMask = buildFieldMask<UniverseBody>(body);
    searchParams.set("updateMask", fieldMask);

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
      searchParams.set("maxPageSize", options.maxPageSize.toString());
    if (options.pageToken) searchParams.set("pageToken", options.pageToken);

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
   * const userRestriction = await client.universes.getUserRestriction('123456789', '123456789');
   * console.log(userRestriction);
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/UserRestriction#Cloud_GetUserRestriction__Using_Universes
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
   * @param userRestrictionId - The user ID (numeric string)
   * @param options - The options for updating the user restriction
   * @param options.universeId - The universe ID (numeric string)
   * @param options.placeId - The place ID (optional) (numeric string)
   * @param options.body - The user restriction data to update
   * @returns Promise resolving to the user restriction response
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If an API error occurs
   *
   * @example
   * ```typescript
   * const userRestriction = await client.universes.updateUserRestriction('1210019099', {
   *  universeId: '1234',
   *  placeId: '5678',
   *  body: {
   *    active: true,
   *    duration: "3s",
   *    privateReason: "some private reason",
   *    displayReason: "some display reason",
   *    excludeAltAccounts: true
   *  }
   * });
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/UserRestriction#Cloud_UpdateUserRestriction__Using_Universes_Places
   */
  async updateUserRestriction(
    userRestrictionId: string,
    options: UpdateUserRestrictionOptions,
  ): Promise<UserRestriction> {
    const { body, universeId, placeId } = options;
    const searchParams = new URLSearchParams();

    searchParams.set("updateMask", "game_join_restriction");

    const idempotencyKey = generateIdempotencyKey();
    const firstSent = new Date().toISOString();

    searchParams.set("idempotencyKey.key", idempotencyKey);
    searchParams.set("idempotencyKey.firstSent", firstSent);

    let resourcePath = `/cloud/v2/universes/${universeId}`;

    // This resource has two different paths, one for universe-level restrictions, and another for place-level restrictions
    if (placeId) {
      resourcePath += `/places/${placeId}`;
    }

    resourcePath += `/user-restrictions/${userRestrictionId}`;

    // API returns 400 if duration is set as an empty string
    if (body.duration && body.duration === "") body.duration = undefined;

    return this.http.request<UserRestriction>(resourcePath.toString(), {
      method: "PATCH",
      body: JSON.stringify({ gameJoinRestriction: body }),
      searchParams,
    });
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
   * const userRestrictionLogs = await client.universes.listUserRestrictionLogs('123456789', {
   *   maxPageSize: 50,
   *   filter: `"user == 'users/123'" && "place == 'places/456'"`
   * });
   * console.log(userRestrictionLogs);
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/UserRestriction#Cloud_ListUserRestrictionLogs
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

  /**
   * Generates an English speech audio asset from the specified text.
   *
   * This endpoint requires the `asset:read` and `asset:write` scopes in addition to the `universe:write` scope.
   *
   * @param universeId - The universe ID (numeric string)
   * @param body - The speech asset generation request body
   * @returns Promise resolving to the speech asset response
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the universeId is invalid or other API error occurs
   *
   * @example
   * ```typescript
   * const speechAsset = await client.universes.generateSpeechAsset('123456789', {
   *   text: "Hello, world!",
   *   speechStyle: {
   *     voiceId: "rbx_voice_001",
   *     pitch: 1,
   *     speed: 1
   *   }
   * });
   * console.log(speechAsset);
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/Universe#Cloud_GenerateSpeechAsset
   */
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

  /**
   * Publishes a message to the universe's live servers.
   * Servers can consume messages via MessagingService.
   *
   * @param universeId The universe ID (numeric string)
   * @param body The publish message request body
   * @returns Promise resolving to void
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the universeId is invalid or other API error occurs
   *
   * @example
   * ```typescript
   * await client.universes.publishMessage('123456789', {
   *   topic: "UpdateAvailable",
   *   message: "New update has been deployed!"
   * });
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/Universe#Cloud_PublishUniverseMessage
   */
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

  /**
   * Translates the provided text from one language to another.
   *
   * The language codes are represented as IETF BCP-47 language tags. The currently supported language codes are:
   * - English (en-us)
   * - French (fr-fr)
   * - Vietnamese (vi-vn)
   * - Thai (th-th)
   * - Turkish (tr-tr)
   * - Russian (ru-ru)
   * - Spanish (es-es)
   * - Portuguese (pt-br)
   * - Korean (ko-kr)
   * - Japanese (ja-jp)
   * - Chinese Simplified (zh-cn)
   * - Chinese Traditional (zh-tw)
   * - German (de-de)
   * - Polish (pl-pl)
   * - Italian (it-it)
   * - Indonesian (id-id).
   *
   * If a source language code is not provided, the API will attempt to auto-detect the source language.
   *
   * @param universeId The universe ID (numeric string)
   * @param body The translate text request body
   * @returns Promise resolving to the text translation response
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the universeId is invalid or other API error occurs
   *
   * @example
   * ```typescript
   * const translation = await client.universes.translateText('123456789', {
   *   text: "Hello, world!",
   *   sourceLanguageCode: "en-us",
   *   targetLanguageCodes: ["fr-fr", "ja-jp"]
   * });
   * console.log(translation);
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/Universe#Cloud_TranslateText
   */
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
