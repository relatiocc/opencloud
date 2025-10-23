# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported |
| ------- | --------- |
| 1.x.x   | ✅        |
| < 1.0   | ❌        |

We recommend always using the latest version of `@relatiohq/opencloud` to ensure you have the latest security patches and improvements.

## Reporting a Vulnerability

We take the security of `@relatiohq/opencloud` seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities through GitHub's Security tab:

**[Report a vulnerability](https://github.com/relatiocc/opencloud/security/advisories/new)**

Alternatively, you can use the "Security" tab on the repository and click "Report a vulnerability".

### What to Expect

After submitting a report, you can expect:

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours.

2. **Assessment**: We will investigate and assess the vulnerability, keeping you informed of our progress.

3. **Resolution Timeline**:
   - Critical vulnerabilities: Patch within 7 days
   - High severity: Patch within 14 days
   - Medium severity: Patch within 30 days
   - Low severity: Included in next regular release

4. **Disclosure**: Once a fix is available, we will:
   - Release a security patch
   - Publish a security advisory
   - Credit you for the discovery (unless you prefer to remain anonymous)

## Known Security Considerations

### Zero Dependencies

This SDK has zero runtime dependencies, which significantly reduces the attack surface and dependency-related vulnerabilities. All HTTP requests are made using the native `fetch` API.

### TypeScript Safety

The SDK is written in TypeScript with strict type checking enabled, reducing the risk of type-related vulnerabilities and runtime errors.

### API Key Transmission

API keys are transmitted via the `x-api-key` header over HTTPS. Never use this SDK over unencrypted HTTP connections in production.

## Security Updates

Security updates are released as soon as possible after a vulnerability is confirmed. Subscribe to:

- **GitHub Security Advisories**: Watch the repository for security updates
- **npm/pnpm**: Use `pnpm audit` to detect vulnerable versions
- **Release Notes**: Check [CHANGELOG.md](./CHANGELOG.md) for security-related updates

## Scope

This security policy applies to:

- The `@relatiohq/opencloud` package
- The source code in this repository
- Published versions on npm

This policy does NOT cover:

- Third-party applications using this SDK
- Roblox Open Cloud API itself (report to Roblox directly)
- Development/test dependencies (not included in production builds)

## Additional Resources

- [Roblox Open Cloud Security Best Practices](https://create.roblox.com/docs/cloud/open-cloud)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Contact

For security concerns, use: [GitHub Security Advisories](https://github.com/relatiocc/opencloud/security/advisories/new)

For general questions, use: [GitHub Issues](https://github.com/relatiocc/opencloud/issues)

---

Thank you for helping keep `@relatiohq/opencloud` and its users safe!
