# Getting Started

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

## Quick Start

```typescript
import { OpenCloud } from "@relatiohq/opencloud";

// Initialize the client with your API key
const client = new OpenCloud({
  apiKey: process.env.ROBLOX_API_KEY,
});

// Get user information
const user = await client.users.get("123456789");
console.log(user.displayName); // "John Doe"

// Get group details
const group = await client.groups.get("987654321");
console.log(group.displayName); // "My Group"
```

## Key Features

- **🔒 Type-Safe** - Full TypeScript support with autocomplete
- **🪶 Lightweight** - Zero dependencies, tree-shakeable
- **🔄 Auto-Retry** - Built-in exponential backoff for failed requests
- **⚡ Modern** - Uses native `fetch` API (Node.js 18+)

## Common Examples

### Fetch User Inventory

```typescript
// Get a user's inventory items
const inventory = await client.users.listInventoryItems("123456789", {
  maxPageSize: 50,
  filter: "inventoryItemAssetTypes=HAT,CLASSIC_PANTS",
});

for (const item of inventory.inventoryItems) {
  console.log(item.assetDetails.displayName);
}
```

### Generate User Thumbnail

```typescript
const thumbnail = await client.users.generateThumbnail("123456789", {
  size: 420,
  format: "PNG",
  shape: "ROUND",
});

console.log(thumbnail.response.imageUri);
```

### List Group Members

```typescript
const members = await client.groups.listGroupMemberships("987654321", {
  maxPageSize: 100,
  filter: "role == 'groups/987654321/roles/12345678'",
});

console.log(`Total members: ${members.groupMemberships.length}`);
```