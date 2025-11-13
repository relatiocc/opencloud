import { HttpClient, HttpOptions } from "./http";
import { Groups } from "./resources/groups";
import { Universes } from "./resources/universes";
import { Users } from "./resources/users";
import type { AuthConfig } from "./types/auth";

/**
 * Configuration options for initializing the OpenCloud SDK client.
 */
export interface OpenCloudConfig {
  /**
   * Roblox Open Cloud API key for authentication.
   * This is optional and if not provided, you must use withAuth() for per-request authentication.
   */
  apiKey?: string;
  /** Custom user agent string for API requests (defaults to "@relatiohq/opencloud") */
  userAgent?: string;
  /** Base URL for the Roblox API (defaults to "https://apis.roblox.com") */
  baseUrl?: string;
  /** Retry configuration for failed requests */
  retry?: HttpOptions["retry"];
  /** Custom fetch implementation (useful for testing or custom environments) */
  fetchImpl?: HttpOptions["fetchImpl"];
}

/**
 * Main entry point for the Roblox Open Cloud SDK.
 * Provides access to all Roblox Open Cloud API resources.
 *
 * @example
 * ```typescript
 * // Traditional usage with API key
 * const client = new OpenCloud({
 *   apiKey: 'your-api-key-here'
 * });
 * const user = await client.users.get('123456789');
 * console.log(user.displayName);
 *
 * // Multi-tenant usage with per-request OAuth2
 * const client = new OpenCloud(); // No default auth
 * const userClient = client.withAuth({
 *   kind: "oauth2",
 *   accessToken: "user-token"
 * });
 * const groups = await userClient.groups.listMemberships("123456");
 * ```
 */
export class OpenCloud {
  public groups!: Groups;
  public universes!: Universes;
  public users!: Users;
  private http!: HttpClient;

  /**
   * Creates a new OpenCloud SDK client instance.
   *
   * @param config - Configuration options for the client
   */
  constructor(config: OpenCloudConfig = {}) {
    this.http = new HttpClient({
      baseUrl: config.baseUrl ?? "https://apis.roblox.com",
      retry: config.retry ?? {
        attempts: 4,
        backoff: "exponential",
        baseMs: 250,
      },
      headers: {
        ...(config.apiKey ? { "x-api-key": config.apiKey } : {}),
        "user-agent": config.userAgent ?? "@relatiohq/opencloud",
      },
      fetchImpl: config.fetchImpl,
    });

    this.initializeResources(this.http);
  }

  /**
   * Initializes all resource endpoints with the provided HTTP client.
   * @private
   */
  private initializeResources(http: HttpClient): void {
    this.groups = new Groups(http);
    this.universes = new Universes(http);
    this.users = new Users(http);
  }

  /**
   * Creates a scoped client instance with per-request authentication.
   * This allows reusing a single client while providing different credentials for each request.
   *
   * @param auth - Authentication configuration to use for this scope
   * @returns A new scoped OpenCloud instance with the provided auth
   *
   * @example
   * ```typescript
   * const client = new OpenCloud(); // No default auth
   *
   * // OAuth2 authentication
   * const userClient = client.withAuth({
   *   kind: "oauth2",
   *   accessToken: "user-token-here"
   * });
   * const groups = await userClient.groups.listMemberships("123456");
   *
   * // API key authentication
   * const adminClient = client.withAuth({
   *   kind: "apiKey",
   *   apiKey: "admin-key-here"
   * });
   * const user = await adminClient.users.get("789");
   * ```
   */
  withAuth(auth: AuthConfig): OpenCloud {
    const scoped = Object.create(this) as OpenCloud;

    const scopedHttp = Object.create(this.http) as HttpClient;
    scopedHttp.authOverride = auth;

    scoped.http = scopedHttp;
    scoped.initializeResources(scopedHttp);

    return scoped;
  }
}

export * from "./types";
export * from "./errors";
export type { HttpOptions } from "./http";

export { Users } from "./resources/users";
export { Groups } from "./resources/groups";
export { Universes } from "./resources/universes";
