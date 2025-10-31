# Authentication

The OpenCloud SDK supports two authentication methods: API keys and OAuth2 access tokens.

## API Key Authentication

API keys are best for server-side applications that need to access Roblox resources on behalf of your application.

### Getting an API Key

1. Go to the [Roblox Creator Dashboard](https://create.roblox.com/dashboard/credentials)
2. Click **Create API Key**
3. Configure the permissions your application needs
4. Copy the generated API key

::: warning
Keep your API key secret! Never commit it to version control or share it publicly.
:::

### Using the API Key

Pass your API key when creating the OpenCloud client:

```typescript
import { OpenCloud } from "@relatiohq/opencloud";

const client = new OpenCloud({
  apiKey: "your-api-key-here"
});
```

## OAuth2 Authentication

OAuth2 is ideal for applications that need to access Roblox resources on behalf of individual users. This is commonly used in multi-tenant scenarios where each user has their own access token.

### Per-Request Authentication

You can create a client without default credentials and provide authentication per-request using the `withAuth()` method:

```typescript
import { OpenCloud } from "@relatiohq/opencloud";

// Create a client without default authentication
const client = new OpenCloud();

// Use OAuth2 for a specific request
const userClient = client.withAuth({
  kind: "oauth2",
  accessToken: "user-access-token"
});

const groups = await userClient.groups.listGroupMemberships("123456");
```

### Multi-Tenant Server Example

This pattern is perfect for backend services that handle requests from multiple users:

```typescript
import { OpenCloud } from "@relatiohq/opencloud";
import express from "express";

const app = express();
const client = new OpenCloud(); // Shared client, no default auth

app.get("/api/my-groups", async (req, res) => {
  // Get user's access token from request
  const accessToken = req.headers.authorization?.split(" ")[1];

  // Create scoped client for this user
  const userClient = client.withAuth({
    kind: "oauth2",
    accessToken: accessToken!
  });

  // Make requests on behalf of the user
  const memberships = await userClient.groups.listGroupMemberships(req.query.userId);
  res.json(memberships);
});
```

### Overriding Default Authentication

You can also create a client with default authentication and override it per-request:

```typescript
// Client with default API key
const client = new OpenCloud({
  apiKey: "default-api-key"
});

// Most requests use the default API key
const group = await client.groups.get("123");

// But you can override with OAuth2 for specific requests
const userClient = client.withAuth({
  kind: "oauth2",
  accessToken: "user-token"
});
const userGroups = await userClient.groups.listGroupMemberships("456");
```

## Environment Variables

It's recommended to store your API key in environment variables:

```typescript
const client = new OpenCloud({
  apiKey: process.env.ROBLOX_API_KEY!
});
```

### Using .env files

Create a `.env` file in your project root:

```
ROBLOX_API_KEY=your-api-key-here
```

Then load it in your application (using a package like `dotenv`):

```typescript
import "dotenv/config";
import { OpenCloud } from "@relatiohq/opencloud";

const client = new OpenCloud({
  apiKey: process.env.ROBLOX_API_KEY!
});
```

## Authentication Types

The SDK supports two authentication types through the `AuthConfig` type:

### API Key

```typescript
const auth = {
  kind: "apiKey",
  apiKey: "your-api-key"
};

const client = new OpenCloud().withAuth(auth);
```

### OAuth2

```typescript
const auth = {
  kind: "oauth2",
  accessToken: "user-access-token"
};

const client = new OpenCloud().withAuth(auth);
```

## Permissions

When creating your API key, ensure it has the appropriate permissions for the resources you need to access:

- **Users** - Read user information
- **Groups** - Read group information
- **Assets** - Upload and manage assets
- And more...

Refer to the [Roblox Open Cloud documentation](https://create.roblox.com/docs/cloud/open-cloud) for the full list of available permissions.