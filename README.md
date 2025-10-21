# @relatiohq/opencloud

Typed SDK for Roblox Open Cloud

## Installation

```bash
npm install @relatiohq/opencloud
# or
pnpm add @relatiohq/opencloud
# or
yarn add @relatiohq/opencloud
```

## Usage

```typescript
import { OpenCloud } from "@relatiohq/opencloud";

const client = new OpenCloud({
  apiKey: "your-api-key",
});

// Use the client
const user = await client.users.get({ userId: "123456789" });
```

## Documentation

Full API documentation is available at [https://opencloud.relatio.cc](https://opencloud.relatio.cc)

## Features

- Type-safe API client
- Built with modern TypeScript
- Tree-shakeable exports
- Lightweight with zero dependencies
- Automatic retry with exponential backoff

## License

MIT
