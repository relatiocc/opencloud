# Pagination

Many Roblox Open Cloud API endpoints return large datasets that are split into pages. The OpenCloud SDK provides consistent pagination handling across all list methods, making it easy to work with large result sets.

## Understanding Pagination

Paginated responses follow a consistent structure:

```typescript
{
  items: [...],           // Array of results for current page
  nextPageToken?: string  // Token to fetch the next page (undefined on last page)
}
```

The SDK uses different property names based on the resource type, but the pattern is always the same.

## Basic Pagination

### Fetching the First Page

```typescript
// Get first page of user inventory
const firstPage = await client.users.listInventoryItems("123456789");

console.log(`Found ${firstPage.inventoryItems.length} items`);
console.log(`Has more pages: ${!!firstPage.nextPageToken}`);
```

### Fetching the Next Page

Use the `nextPageToken` from the previous response:

```typescript
const firstPage = await client.users.listInventoryItems("123456789");

if (firstPage.nextPageToken) {
  const secondPage = await client.users.listInventoryItems("123456789", {
    pageToken: firstPage.nextPageToken
  });

  console.log(`Page 2 has ${secondPage.inventoryItems.length} items`);
}
```

## Page Size Control

Control how many items are returned per page using `maxPageSize`:

```typescript
// Request up to 50 items per page
const page = await client.users.listInventoryItems("123456789", {
  maxPageSize: 50
});
```

::: tip
The API may return fewer items than requested, even if more are available. Always check `nextPageToken` to determine if there are more pages.
:::

::: warning
The API has maximum limits for `maxPageSize`. If you request too many items, the API will cap the response to its maximum allowed value.
:::

## Iterating Through All Pages

### Manual Iteration

```typescript
let pageToken: string | undefined;
let allItems: InventoryItem[] = [];

do {
  const page = await client.users.listInventoryItems("123456789", {
    maxPageSize: 100,
    pageToken
  });

  allItems.push(...page.inventoryItems);
  pageToken = page.nextPageToken;

  console.log(`Fetched ${allItems.length} items so far...`);
} while (pageToken);

console.log(`Total items: ${allItems.length}`);
```

### Using a Reusable Function

Create a helper function to fetch all pages:

```typescript
async function fetchAllPages<T extends { nextPageToken?: string }>(
  fetchPage: (pageToken?: string) => Promise<T>,
  getItems: (page: T) => unknown[]
): Promise<unknown[]> {
  let allItems: unknown[] = [];
  let pageToken: string | undefined;

  do {
    const page = await fetchPage(pageToken);
    allItems.push(...getItems(page));
    pageToken = page.nextPageToken;
  } while (pageToken);

  return allItems;
}

// Usage
const allInventory = await fetchAllPages(
  (pageToken) => client.users.listInventoryItems("123456789", { pageToken }),
  (page) => page.inventoryItems
);

console.log(`Total inventory items: ${allInventory.length}`);
```