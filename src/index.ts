import { colors } from "./constants";
import { HttpClient, HttpOptions } from "./http";
import { Logger } from "./logger";
import { Groups } from "./resources/groups";
import { Users } from "./resources/users";
import { VersionChecker } from "./version";

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
  public groups: Groups;

  /**
   * Creates a new Logger instance.
   */
  public logger = new Logger();

  /**
   * Creates a new OpenCloud SDK client instance.
   *
   * @param config - Configuration options for the client
   */
  constructor(config: OpenCloudConfig) {
    const versionChecker = new VersionChecker();

    (async () => {
      const { upToDate, installedVersion, currentVersion } =
        await versionChecker.isUpToDate("@relatiohq/opencloud");

      if (!upToDate) {
        if (installedVersion) {
          let command = "npm install @relatiohq/opencloud@latest";

          if (installedVersion.startsWith("yarn")) {
            command = "yarn add @relatiohq/opencloud@latest";
          }

          if (installedVersion.startsWith("pnpm")) {
            command = "pnpm add @relatiohq/opencloud@latest";
          }

          this.logger.warn(
            `Version ${currentVersion} is available for @relatiohq/opencloud! Run ${colors.green}${colors.bright}${command}${colors.reset} to update.`,
          );
        }
      }
    })();

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
    this.groups = new Groups(http);
  }
}

export * from "./types";
export * from "./errors";
export type { HttpOptions } from "./http";

export { Users } from "./resources/users";
export { Groups } from "./resources/groups";
