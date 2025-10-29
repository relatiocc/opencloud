# Error Handling

The OpenCloud SDK provides structured error classes to help you handle API failures gracefully. Understanding these error types and how to handle them is crucial for building robust applications.

## Error Types

The SDK exports three main error classes:

### OpenCloudError

The base error class for all API-related errors. All other error types extend this class.

```typescript
import { OpenCloudError } from "@relatiohq/opencloud";

try {
  const user = await client.users.get("invalid-user-id");
} catch (error) {
  if (error instanceof OpenCloudError) {
    console.error(`API Error: ${error.message}`);
    console.error(`Status: ${error.status}`);
    console.error(`Code: ${error.code}`);
    console.error(`Details:`, error.details);
  }
}
```

**Properties:**
- `message` - Human-readable error description
- `status` - HTTP status code (e.g., 404, 500)
- `code` - Error code from the API (e.g., "RESOURCE_NOT_FOUND")
- `details` - Additional error information from the API response

### RateLimitError

Thrown when you exceed the API rate limits. This error includes information about when you can retry.

```typescript
import { RateLimitError } from "@relatiohq/opencloud";

try {
  const user = await client.users.get("123456789");
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error("Rate limit exceeded!");
    if (error.retryAfter) {
      console.log(`Retry after ${error.retryAfter} seconds`);
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, error.retryAfter! * 1000));
      // Retry the request
    }
  }
}
```

**Properties:**
- All properties from `OpenCloudError`
- `retryAfter` - Number of seconds to wait before retrying (optional)

### AuthError

Thrown when authentication fails, typically due to an invalid or missing API key.

```typescript
import { AuthError } from "@relatiohq/opencloud";

try {
  const user = await client.users.get("123456789");
} catch (error) {
  if (error instanceof AuthError) {
    console.error("Authentication failed!");
    console.error("Please check your API key and permissions.");
    // Log the user out or prompt for new credentials
  }
}
```

## Common Error Scenarios

### 404 Not Found

When a resource doesn't exist (invalid user ID, group ID, etc.):

```typescript
try {
  const user = await client.users.get("999999999999");
} catch (error) {
  if (error instanceof OpenCloudError && error.status === 404) {
    console.error("User not found");
    // Handle missing resource
  }
}
```

### 401 Unauthorized

When your API key is invalid or missing required permissions:

```typescript
try {
  const group = await client.groups.get("123456789");
} catch (error) {
  if (error instanceof AuthError && error.status === 401) {
    console.error("Invalid API key");
    // Prompt user to update credentials
  }
}
```

### 403 Forbidden

When you don't have permission to access a resource:

```typescript
try {
  const inventory = await client.users.listInventoryItems("123456789");
} catch (error) {
  if (error instanceof AuthError && error.status === 403) {
    console.error("Insufficient permissions");
    console.error("Your API key needs the 'Users' read permission");
  }
}
```

### 429 Rate Limited

When you've made too many requests:

```typescript
try {
  // Making many requests in a loop
  for (const userId of userIds) {
    await client.users.get(userId);
  }
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error("Rate limit hit!");
    // The SDK automatically retries with exponential backoff
    // This error is thrown only after all retry attempts fail
  }
}
```

## Type Guards

Use TypeScript type guards to safely check error types:

```typescript
function isOpenCloudError(error: unknown): error is OpenCloudError {
  return error instanceof OpenCloudError;
}

function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}

function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

// Usage
try {
  const user = await client.users.get(userId);
} catch (error) {
  if (isAuthError(error)) {
    // TypeScript knows error is AuthError here
    console.error("Auth failed:", error.status);
  } else if (isRateLimitError(error)) {
    // TypeScript knows error is RateLimitError here
    console.error("Rate limited, retry after:", error.retryAfter);
  } else if (isOpenCloudError(error)) {
    // TypeScript knows error is OpenCloudError here
    console.error("API error:", error.code);
  } else {
    // Unknown error type
    console.error("Unexpected error:", error);
  }
}
```