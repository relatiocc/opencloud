import { OpenCloudError, RateLimitError, AuthError } from "./errors";

export type Backoff = "exponential" | "fixed";

/**
 * Configuration for HTTP request retry behavior.
 */
export interface HttpRetry {
  /** Maximum number of retry attempts */
  attempts: number;
  /** Backoff strategy: "exponential" for exponential backoff, "fixed" for constant delays */
  backoff: Backoff;
  /** Base delay in milliseconds between retries (defaults to 250ms) */
  baseMs?: number;
}

/**
 * Configuration options for the HTTP client.
 */
export interface HttpOptions {
  /** Base URL for all API requests */
  baseUrl: string;
  /** Default headers to include in all requests */
  headers?: Record<string, string>;
  /** Retry configuration for failed requests */
  retry?: HttpRetry;
  /** Custom fetch implementation (useful for Node.js < 18 or testing) */
  fetchImpl?: typeof fetch;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Safely parses error details from an API response.
 * Returns undefined if the response body is not valid JSON.
 */
const parseErrorDetails = async (
  response: Response,
): Promise<OpenCloudError | undefined> => {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

/**
 * HTTP client for making requests to the Roblox Open Cloud API.
 * Handles authentication, retries, rate limiting, and error handling.
 */
export class HttpClient {
  private fetcher: typeof fetch;

  /**
   * Creates a new HttpClient instance.
   *
   * @param options - HTTP client configuration options
   * @throws Error if no fetch implementation is available
   */
  constructor(private options: HttpOptions) {
    this.fetcher = options.fetchImpl ?? globalThis.fetch;
    if (!this.fetcher) {
      throw new Error(
        "No global fetch found. Please provide a fetch implementation in HttpOptions.",
      );
    }
  }

  /**
   * Calculates the delay for the next retry attempt based on the backoff strategy.
   *
   * @param attempt - Current attempt number (0-indexed)
   * @param retry - Retry configuration
   * @returns Delay in milliseconds before the next retry
   */
  private nextBackoff(attempt: number, retry: HttpRetry): number {
    const base = retry.baseMs ?? 250;
    if (retry.backoff === "fixed") return base;

    const expo = base * Math.pow(2, attempt);
    return Math.round(expo * (0.75 + Math.random() * 0.5));
  }

  /**
   * Makes an HTTP request to the API with automatic retry logic and error handling.
   *
   * @template T - Expected response type
   * @param path - API endpoint path (relative to baseUrl)
   * @param init - Fetch options including method, headers, body, and optional searchParams
   * @returns Promise resolving to the parsed response data
   * @throws {AuthError} When authentication fails (401/403)
   * @throws {RateLimitError} When rate limits are exceeded after all retries
   * @throws {OpenCloudError} For other API errors
   */
  async request<T>(
    path: string,
    init: RequestInit & { searchParams?: URLSearchParams } = {},
  ): Promise<T> {
    const retry = this.options.retry ?? {
      attempts: 4,
      backoff: "exponential",
      baseMs: 250,
    };
    const url = new URL(this.options.baseUrl + path);
    if (init.searchParams) url.search = init.searchParams.toString();

    const headers = new Headers({
      "content-type": "application/json",
      ...this.options.headers,
      ...init.headers,
    });

    for (let attempt = 0; attempt <= retry.attempts; attempt++) {
      const response = await this.fetcher(url, { ...init, headers });

      if (response.status === 401 || response.status === 403) {
        const details = await parseErrorDetails(response);
        throw new AuthError(
          "Unauthorized: invalid or missing Open Cloud credentials",
          response.status,
          details,
        );
      }

      if (response.ok) {
        if (response.status === 204) return undefined as unknown as T;
        const text = await response.text();
        return text ? (JSON.parse(text) as T) : (undefined as unknown as T);
      }

      if (response.status === 429 || response.status >= 500) {
        if (attempt < retry.attempts) {
          const retryAfterHeader = response.headers.get("x-ratelimit-reset");
          const wait = retryAfterHeader
            ? parseFloat(retryAfterHeader) * 1000
            : this.nextBackoff(attempt, retry);
          await sleep(wait);
          continue;
        }

        if (response.status === 429) {
          const retryAfterHeader = response.headers.get("x-ratelimit-reset");
          const details = await parseErrorDetails(response);
          throw new RateLimitError(
            "Rate limit exceeded",
            retryAfterHeader ? parseFloat(retryAfterHeader) : undefined,
            details,
          );
        }
      }

      const details = await parseErrorDetails(response);
      throw new OpenCloudError(
        `HTTP ${response.status}`,
        response.status,
        details?.code,
        details,
      );
    }

    throw new OpenCloudError("Exhausted retries without a successful response");
  }
}
