# @relatiohq/opencloud

[![npm version](https://img.shields.io/npm/v/@relatiohq/opencloud.svg)](https://www.npmjs.com/package/@relatiohq/opencloud)
[![npm downloads](https://img.shields.io/npm/dm/@relatiohq/opencloud.svg)](https://www.npmjs.com/package/@relatiohq/opencloud)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![codecov](https://codecov.io/gh/relatiocc/opencloud/branch/main/graph/badge.svg)](https://codecov.io/gh/relatiocc/opencloud)

A lightweight, type-safe TypeScript SDK for interacting with the Roblox Open Cloud API. Zero dependencies, built-in retry logic, and full TypeScript support.

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
const user = await client.users.get("123456789");
```

## Documentation

Full API documentation is available at [https://opencloud.relatio.cc](https://opencloud.relatio.cc)

## Features

- Type-safe API client
- Built with modern TypeScript
- Tree-shakeable exports
- Lightweight with zero dependencies
- Automatic retry with exponential backoff

## Why Use This SDK?

### vs. Manual API Calls

**Without SDK:**

```typescript
// Manual fetch with error handling, retries, rate limiting...
const response = await fetch(
  `https://apis.roblox.com/cloud/v2/users/${userId}`,
  {
    headers: { "x-api-key": apiKey },
  },
);
if (!response.ok) {
  // Handle errors manually
  throw new Error(`API error: ${response.status}`);
}
const data = await response.json();
// No type safety, no automatic retries
```

**With SDK:**

```typescript
// Type-safe, automatic retries, built-in error handling
const user = await client.users.get(userId);
// Full TypeScript autocomplete and type checking
```

## Security

Security is a top priority. Please review our [Security Policy](SECURITY.md) for:

- Supported versions
- How to report vulnerabilities
- Security best practices for API key management
- Safe usage guidelines

**Never commit API keys to version control!** Always use environment variables or secure secret management.

## Contributing

Contributions are welcome! Please read our [contributing guide](CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes.

## Acknowledgments

This project is built with:

- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [tsup](https://tsup.egoist.dev/) - Fast TypeScript bundler
- [Vitest](https://vitest.dev/) - Lightning fast unit testing
- [TypeDoc](https://typedoc.org/) - Documentation generation

Special thanks to:

- The Roblox team for providing the Open Cloud API
- All [contributors](https://github.com/relatiocc/opencloud/graphs/contributors) who help improve this SDK
- The TypeScript community for excellent tooling

## License

MIT © [Relatio](https://github.com/relatiocc)

---

**Note**: This is an unofficial SDK and is not affiliated with, endorsed by, or sponsored by Roblox Corporation.
