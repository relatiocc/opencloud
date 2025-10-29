# Authentication

The OpenCloud SDK requires a Roblox Open Cloud API key for authentication.

## Getting an API Key

1. Go to the [Roblox Creator Dashboard](https://create.roblox.com/dashboard/credentials)
2. Click **Create API Key**
3. Configure the permissions your application needs
4. Copy the generated API key

::: warning
Keep your API key secret! Never commit it to version control or share it publicly.
:::

## Using the API Key

Pass your API key when creating the OpenCloud client:

```typescript
import { OpenCloud } from "@relatiohq/opencloud";

const client = new OpenCloud({
  apiKey: "your-api-key-here"
});
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

## Permissions

When creating your API key, ensure it has the appropriate permissions for the resources you need to access:

- **Users** - Read user information
- **Groups** - Read group information
- **Assets** - Upload and manage assets
- And more...

Refer to the [Roblox Open Cloud documentation](https://create.roblox.com/docs/cloud/open-cloud) for the full list of available permissions.
