# Rate Limiting

The Roblox Open Cloud API enforces rate limits to ensure fair usage and system stability. The OpenCloud SDK provides automatic retry logic to handle rate limits gracefully.

## Understanding Rate Limits

When you exceed the API's rate limits, you'll receive a `429 Too Many Requests` response. The SDK automatically catches these and retries with exponential backoff.

## Automatic Retry

The SDK includes built-in retry logic that handles rate limits automatically:

```typescript
const client = new OpenCloud({
  apiKey: process.env.ROBLOX_API_KEY!,
  retry: {
    attempts: 4,           // Number of retry attempts (default: 4)
    backoff: "exponential" // Exponential backoff strategy (default)
  }
});

// The SDK will automatically retry if rate limited
const user = await client.users.get("123456789");
```

::: tip
The default retry configuration is suitable for most use cases. The SDK will wait increasingly longer between retries: 1s, 2s, 4s, 8s.
:::

## Handling Rate Limit Errors

If all retry attempts are exhausted, the SDK throws a `RateLimitError`:

```typescript
import { RateLimitError } from "@relatiohq/opencloud";

try {
  const user = await client.users.get("123456789");
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log("Rate limit exceeded after all retries");

    if (error.retryAfter) {
      console.log(`Wait ${error.retryAfter} seconds before retrying`);

      // Wait and retry manually
      await new Promise(resolve => setTimeout(resolve, error.retryAfter! * 1000));
      const user = await client.users.get("123456789");
    }
  }
}
```

## Best Practices

### 1. Implement Caching

Avoid making repeated requests for the same data:

```typescript
const cache = new Map<string, { data: any, expires: number }>();

async function getUserCached(userId: string) {
  const cached = cache.get(userId);

  if (cached && Date.now() < cached.expires) {
    return cached.data;
  }

  const user = await client.users.get(userId);

  // Cache for 5 minutes
  cache.set(userId, {
    data: user,
    expires: Date.now() + 5 * 60 * 1000
  });

  return user;
}
```

### 2. Batch Operations

When processing multiple items, add delays between requests:

```typescript
const userIds = ["123", "456", "789", "012"];

for (const userId of userIds) {
  try {
    const user = await client.users.get(userId);
    console.log(user.displayName);

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
  }
}
```

### 3. Use Pagination Wisely

Don't request too many items at once:

```typescript
// Good: Reasonable page size
const members = await client.groups.listGroupMemberships("123456789", {
  maxPageSize: 100
});

// Avoid: Requesting maximum items too frequently
const members = await client.groups.listGroupMemberships("123456789", {
  maxPageSize: 1000
});
```

### 4. Monitor Your Usage

Keep track of rate limit errors to identify problematic patterns:

```typescript
let rateLimitCount = 0;

async function fetchWithMonitoring(userId: string) {
  try {
    return await client.users.get(userId);
  } catch (error) {
    if (error instanceof RateLimitError) {
      rateLimitCount++;
      console.warn(`Rate limit hit ${rateLimitCount} times`);
    }
    throw error;
  }
}
```

## Custom Retry Configuration

You can customize the retry behavior:

```typescript
// More aggressive retries
const client = new OpenCloud({
  apiKey: process.env.ROBLOX_API_KEY!,
  retry: {
    attempts: 6,           // More retry attempts
    backoff: "exponential"
  }
});

// Disable retries (not recommended)
const client = new OpenCloud({
  apiKey: process.env.ROBLOX_API_KEY!,
  retry: {
    attempts: 0
  }
});
```

## Rate Limit Headers

The Roblox API may include rate limit information in response headers. While the SDK handles retries automatically, you can implement custom logic if needed by catching errors and examining the `retryAfter` property.

::: warning
Excessive rate limiting may indicate a problem with your implementation. Consider refactoring your code to make fewer requests or implementing caching.
:::
