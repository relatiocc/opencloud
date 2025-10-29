# Users Resource

The Users resource provides methods to interact with Roblox user data, including profile information, inventory, thumbnails, and notifications.

## Getting User Information

Retrieve basic user profile information by user ID:

```typescript
const user = await client.users.get("123456789");

console.log(user.displayName);  // "John Doe"
console.log(user.name);         // "@johndoe"
console.log(user.hasVerifiedBadge);
```

## Generating Thumbnails

Generate avatar thumbnails with customizable size, format, and shape:

```typescript
const thumbnail = await client.users.generateThumbnail("123456789", {
  size: 420,     // 48, 50, 60, 75, 100, 110, 150, 180, 352, 420, 720
  format: "PNG", // PNG, JPEG
  shape: "ROUND" // ROUND, SQUARE
});

console.log(thumbnail.response.imageUri);
```

::: tip
The default size is 420px if not specified. This is a good balance between quality and file size.
:::

## Working with Inventory

List items in a user's inventory with optional filtering:

```typescript
// Get all inventory items
const inventory = await client.users.listInventoryItems("123456789");

for (const item of inventory.inventoryItems) {
  console.log(item.assetDetails.displayName);
  console.log(item.assetDetails.assetType);
}
```

### Filtering by Asset Type

Use filters to retrieve specific types of items:

```typescript
// Get only hats and pants
const items = await client.users.listInventoryItems("123456789", {
  filter: "inventoryItemAssetTypes=HAT,CLASSIC_PANTS"
});
```

### Paginating Large Inventories

For users with many items, use pagination:

```typescript
let pageToken: string | undefined;
let allItems = [];

do {
  const page = await client.users.listInventoryItems("123456789", {
    maxPageSize: 100,
    pageToken
  });

  allItems.push(...page.inventoryItems);
  pageToken = page.nextPageToken;
} while (pageToken);

console.log(`Total items: ${allItems.length}`);
```

See the [Pagination guide](/guide/pagination) for more details.

## Checking Asset Quotas

View upload quotas and usage limits for a user:

```typescript
const quotas = await client.users.listAssetQuotas("123456789");

for (const quota of quotas.assetQuotas) {
  console.log(`Asset Type: ${quota.assetType}`);
  console.log(`Usage: ${quota.usage}`);
  console.log(`Limit: ${quota.quota}`);
  console.log(`Resets at: ${quota.usageResetTime}`);
}
```

## Sending Notifications

Send a notification to a user:

```typescript
await client.users.createNotification("123456789", {
  source: {
    universe: "universes/96623001"
  },
  payload: {
    type: "MOMENT",
    messageId: "daily-reward",
    parameters: {
      rewardType: {
        stringValue: "coins"
      },
      amount: {
        int64Value: "1000"
      }
    },
    joinExperience: {
      launchData: "reward_claim"
    },
    analyticsData: {
      category: "Daily Rewards"
    }
  }
});
```

::: warning
Notifications require proper API key permissions for the specified universe.
:::
