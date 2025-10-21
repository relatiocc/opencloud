/**
 * Base error class for all Roblox Open Cloud API errors.
 * Extends the native Error class with additional context about API failures.
 */
export class OpenCloudError extends Error {
  /**
   * Creates a new OpenCloudError instance.
   *
   * @param message - Human-readable error message
   * @param status - HTTP status code (e.g., 404, 500)
   * @param code - Error code from the API (e.g., "RESOURCE_NOT_FOUND")
   * @param details - Additional error details from the API response
   */
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "OpenCloudError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Error thrown when API rate limits are exceeded.
 * Extends OpenCloudError with retry timing information.
 */
export class RateLimitError extends OpenCloudError {
  /** Number of seconds to wait before retrying (if provided by the API) */
  retryAfter?: number;

  /**
   * Creates a new RateLimitError instance.
   *
   * @param message - Error message (defaults to "Rate limit exceeded")
   * @param retryAfter - Seconds until the rate limit resets
   */
  constructor(message = "Rate limit exceeded", retryAfter?: number) {
    super(message, 429, "rate_limited");
    this.retryAfter = retryAfter;
  }
}

/**
 * Error thrown when authentication fails or credentials are invalid.
 * This typically indicates an invalid or missing API key.
 */
export class AuthError extends OpenCloudError {
  /**
   * Creates a new AuthError instance.
   *
   * @param message - Error message (defaults to a helpful authentication error message)
   */
  constructor(
    message = "Unauthorized: invalid or missing Open Cloud credentials",
  ) {
    super(message, 401, "unauthorized");
  }
}
