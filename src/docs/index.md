---

layout: home
title: Relatio OpenCloud

hero:
  name: Relatio OpenCloud
  text: Typed SDK for Roblox Open Cloud
  tagline: A modern, fully-typed TypeScript SDK for the Roblox Open Cloud API
  image: /cloud.svg

  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: View on GitHub
      link: https://github.com/relatiocc/opencloud

features:
  - icon: 🔒
    title: Type-safe
    details: Fully typed with TypeScript for excellent IDE support and compile-time safety
  - icon: 🚀
    title: Modern
    details: Built with modern JavaScript/TypeScript features and best practices
  - icon: 📦
    title: Easy to use
    details: Simple, intuitive API that mirrors the Roblox Open Cloud structure
  - icon: 🔄
    title: Auto retry
    details: Built-in retry logic with exponential backoff for failed requests
  - icon: 📖
    title: Well documented
    details: Comprehensive documentation with examples for all features
  - icon: ⚡
    title: Lightweight
    details: Minimal dependencies for fast installs and small bundle sizes
---

## Quick Start

```bash
npm install @relatiohq/opencloud
```

```typescript
import { OpenCloud } from "@relatiohq/opencloud";

const client = new OpenCloud({
  apiKey: "your-api-key"
});

const user = await client.users.get("123456789");
console.log(user.displayName);
```