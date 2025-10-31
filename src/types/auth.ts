/**
 * Authentication configuration for API requests.
 * Supports both API key and OAuth2 bearer token authentication.
 */
export type AuthConfig =
  | {
      /** Authentication method using an API key */
      kind: "apiKey";
      /** The API key value */
      apiKey: string;
    }
  | {
      /** Authentication method using OAuth2 */
      kind: "oauth2";
      /** The OAuth2 access token */
      accessToken: string;
    };
