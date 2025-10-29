# Migration Guide

This guide helps you migrate from raw API calls or other solutions to the OpenCloud SDK.

## From Raw Fetch Calls

### Before: Manual API Calls

```typescript
// Manual implementation
const response = await fetch(
  `https://apis.roblox.com/cloud/v2/users/${userId}`,
  {
    headers: {
      "x-api-key": process.env.ROBLOX_API_KEY
    }
  }
);

if (!response.ok) {
  const error = await response.json();
  throw new Error(`API error: ${response.status} - ${error.message}`);
}

const user = await response.json();
```

### After: Using OpenCloud SDK

```typescript
import { OpenCloud } from "@relatiohq/opencloud";

const client = new OpenCloud({
  apiKey: process.env.ROBLOX_API_KEY!
});

// Automatic error handling, retries, and type safety
const user = await client.users.get(userId);
```

## From axios or node-fetch

### Before: Using axios

```typescript
import axios from "axios";

const client = axios.create({
  baseURL: "https://apis.roblox.com",
  headers: {
    "x-api-key": process.env.ROBLOX_API_KEY
  }
});

try {
  const response = await client.get(`/cloud/v2/users/${userId}`);
  const user = response.data;
} catch (error) {
  if (error.response?.status === 429) {
    // Handle rate limiting manually
    await new Promise(resolve => setTimeout(resolve, 5000));
    // Retry...
  }
  throw error;
}
```

### After: Using OpenCloud SDK

```typescript
import { OpenCloud } from "@relatiohq/opencloud";

const client = new OpenCloud({
  apiKey: process.env.ROBLOX_API_KEY!
});

// Built-in rate limit handling and retries
const user = await client.users.get(userId);
```

## Common Migration Patterns

### Getting User Information

```typescript
// Before
const response = await fetch(
  `https://apis.roblox.com/cloud/v2/users/${userId}`
);
const user = await response.json();

// After
const user = await client.users.get(userId);
```

### Listing Inventory with Pagination

```typescript
// Before
let allItems = [];
let pageToken = undefined;

do {
  const url = new URL(`https://apis.roblox.com/cloud/v2/users/${userId}/inventory-items`);
  if (pageToken) url.searchParams.set("pageToken", pageToken);

  const response = await fetch(url, {
    headers: { "x-api-key": apiKey }
  });
  const data = await response.json();

  allItems.push(...data.inventoryItems);
  pageToken = data.nextPageToken;
} while (pageToken);

// After
let allItems = [];
let pageToken = undefined;

do {
  const page = await client.users.listInventoryItems(userId, { pageToken });
  allItems.push(...page.inventoryItems);
  pageToken = page.nextPageToken;
} while (pageToken);
```

### Getting Group Members

```typescript
// Before
const response = await fetch(
  `https://apis.roblox.com/cloud/v2/groups/${groupId}/memberships`,
  {
    headers: { "x-api-key": apiKey }
  }
);
const data = await response.json();
const members = data.groupMemberships;

// After
const page = await client.groups.listGroupMemberships(groupId);
const members = page.groupMemberships;
```

### Accepting Join Requests

```typescript
// Before
await fetch(
  `https://apis.roblox.com/cloud/v2/groups/${groupId}/join-requests/${requestId}:accept`,
  {
    method: "POST",
    headers: { "x-api-key": apiKey }
  }
);

// After
await client.groups.acceptGroupJoinRequest(groupId, requestId);
```

## Benefits of Migration

### 1. Type Safety

```typescript
// TypeScript knows the exact structure
const user = await client.users.get("123456789");
user.displayName; // ✓ Type-safe
user.invalidField; // ✗ TypeScript error
```

### 2. Automatic Error Handling

```typescript
// SDK provides structured error types
import { OpenCloudError, RateLimitError, AuthError } from "@relatiohq/opencloud";

try {
  const user = await client.users.get("123456789");
} catch (error) {
  if (error instanceof RateLimitError) {
    // Handle rate limiting
  } else if (error instanceof AuthError) {
    // Handle auth issues
  }
}
```

### 3. Built-in Retries

```typescript
// No manual retry logic needed
const client = new OpenCloud({
  apiKey: process.env.ROBLOX_API_KEY!,
  retry: {
    attempts: 4,
    backoff: "exponential"
  }
});
```

### 4. Cleaner Code

```typescript
// Before: Verbose
const url = new URL(`https://apis.roblox.com/cloud/v2/users/${userId}/inventory-items`);
url.searchParams.set("maxPageSize", "50");
url.searchParams.set("filter", "inventoryItemAssetTypes=HAT");
const response = await fetch(url, { headers: { "x-api-key": apiKey } });
const data = await response.json();

// After: Concise
const data = await client.users.listInventoryItems(userId, {
  maxPageSize: 50,
  filter: "inventoryItemAssetTypes=HAT"
});
```

## Installation

::: code-group

```sh [npm]
$ npm install @relatiohq/opencloud
```

```sh [pnpm]
$ pnpm add @relatiohq/opencloud
```

```sh [yarn]
$ yarn add @relatiohq/opencloud
```

```sh [bun]
$ bun add @relatiohq/opencloud
```

:::

Then replace your existing API calls with the SDK methods. The SDK is lightweight with zero dependencies, so it won't bloat your project.
