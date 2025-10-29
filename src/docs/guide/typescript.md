# TypeScript Integration

The OpenCloud SDK is built with TypeScript and provides full type safety out of the box. This guide shows you how to get the most out of TypeScript features.

## Type Inference

The SDK automatically infers types for all API responses:

```typescript
const user = await client.users.get("123456789");

// TypeScript knows the exact structure
user.displayName;        // string
user.name;               // string
user.hasVerifiedBadge;   // boolean
user.created;            // string (ISO date)
```

## Importing Types

All types are exported from the main package:

```typescript
import {
  OpenCloud,
  User,
  Group,
  InventoryItem,
  GroupRole,
  GroupMembershipItem
} from "@relatiohq/opencloud";
```

## Type Guards

Use type guards to narrow error types:

```typescript
import { OpenCloudError, RateLimitError, AuthError } from "@relatiohq/opencloud";

try {
  const user = await client.users.get("123456789");
} catch (error) {
  if (error instanceof RateLimitError) {
    // TypeScript knows this is a RateLimitError
    console.log(error.retryAfter); // number | undefined
  } else if (error instanceof AuthError) {
    // TypeScript knows this is an AuthError
    console.log(error.status); // number
  } else if (error instanceof OpenCloudError) {
    // TypeScript knows this is an OpenCloudError
    console.log(error.code); // string
  }
}
```

## Configuration Types

Type-safe client configuration:

```typescript
import type { OpenCloudConfig } from "@relatiohq/opencloud";

const config: OpenCloudConfig = {
  apiKey: process.env.ROBLOX_API_KEY!,
  userAgent: "MyApp/1.0",
  baseUrl: "https://apis.roblox.com",
  retry: {
    attempts: 4,
    backoff: "exponential"
  }
};

const client = new OpenCloud(config);
```

## Working with Enums

The SDK exports enums for common values:

```typescript
import type { AssetType, InventoryItemAssetType } from "@relatiohq/opencloud";

// Filter by specific asset types
const items = await client.users.listInventoryItems("123456789", {
  filter: "inventoryItemAssetTypes=HAT,CLASSIC_PANTS"
});

// TypeScript knows the asset type
items.inventoryItems.forEach(item => {
  const assetType: string = item.assetDetails.assetType;
  // Could be: "HAT", "CLASSIC_PANTS", "TSHIRT", etc.
});
```

## Strict Mode

The SDK works great with TypeScript strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

## Type-Safe Helper Functions

Create type-safe helper functions using SDK types:

```typescript
import type { User, Group } from "@relatiohq/opencloud";

async function getUsersByIds(userIds: string[]): Promise<User[]> {
  const users: User[] = [];

  for (const userId of userIds) {
    const user = await client.users.get(userId);
    users.push(user);
  }

  return users;
}

async function getGroupRoleByName(
  groupId: string,
  roleName: string
): Promise<GroupRole | undefined> {
  const roles = await client.groups.listGroupRoles(groupId);
  return roles.groupRoles.find(role => role.displayName === roleName);
}
```

## IDE Support

With full TypeScript support, you get:

- **Autocomplete** - IntelliSense suggests available methods and properties
- **Type Checking** - Catch errors before runtime
- **Documentation** - Hover over methods to see JSDoc comments
- **Refactoring** - Rename symbols safely across your codebase

::: tip
Use a TypeScript-aware IDE like VS Code, WebStorm, or Cursor for the best development experience.
:::
