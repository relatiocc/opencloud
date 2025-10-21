import { HttpClient, HttpOptions } from "./http";
import { Users } from "./resources/users";

/**
 * Configuration options for initializing the OpenCloud SDK client.
 */
export interface OpenCloudConfig {
  /** Roblox Open Cloud API key for authentication */
  apiKey: string;
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
 * const client = new OpenCloud({
 *   apiKey: 'your-api-key-here'
 * });
 *
 * const user = await client.users.get('123456789');
 * console.log(user.displayName);
 * ```
 */
export class OpenCloud {
  /** Access to Users API endpoints */
  public users: Users;

  /**
   * Creates a new OpenCloud SDK client instance.
   *
   * @param config - Configuration options for the client
   */
  constructor(config: OpenCloudConfig) {
    const http = new HttpClient({
      baseUrl: config.baseUrl ?? "https://apis.roblox.com",
      retry: config.retry ?? {
        attempts: 4,
        backoff: "exponential",
        baseMs: 250,
      },
      headers: {
        "x-api-key": config.apiKey,
        "user-agent": config.userAgent ?? "@relatiohq/opencloud",
      },
      fetchImpl: config.fetchImpl,
    });

    this.users = new Users(http);
  }
}

export * from "./types";
export * from "./errors";
export type { HttpOptions } from "./http";

export { Users } from "./resources/users";
