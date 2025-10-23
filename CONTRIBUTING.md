# Contributing to @relatiohq/opencloud

Thank you for your interest in contributing to `@relatiohq/opencloud`! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please be respectful and professional in all interactions.

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 10.17.1 (this project uses pnpm as its package manager)
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/relatiocc/opencloud.git
   cd opencloud
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/relatiocc/opencloud.git
   ```

## Development Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Build the project:

   ```bash
   pnpm build
   ```

3. Run tests to ensure everything is working:
   ```bash
   pnpm test
   ```

## Project Structure

```
opencloud/
├── src/                    # Source code
│   ├── resources/          # API resource implementations (users, groups, etc.)
│   ├── types/              # TypeScript type definitions
│   ├── errors.ts           # Custom error classes
│   ├── http.ts             # HTTP client implementation
│   └── index.ts            # Main entry point
├── test/                   # Test files
│   ├── _utils.ts           # Test utilities
│   └── *.test.ts           # Test suites
├── docs/                   # Generated documentation
├── dist/                   # Built output (generated)
└── coverage/               # Test coverage reports (generated)
```

## Development Workflow

### Creating a New Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:

- `feature/` - for new features
- `fix/` - for bug fixes
- `docs/` - for documentation changes
- `refactor/` - for code refactoring
- `test/` - for test additions or modifications

### Making Changes

1. **Write your code** following our [coding standards](#coding-standards)
2. **Add tests** for any new functionality
3. **Update documentation** if you're changing APIs or adding features
4. **Run the test suite** to ensure everything passes

### Available Scripts

- `pnpm build` - Build the project
- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode
- `pnpm coverage` - Generate test coverage report
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run ESLint
- `pnpm lint:format` - Check code formatting
- `pnpm format` - Format code with Prettier
- `pnpm docs` - Generate documentation
- `pnpm docs:watch` - Generate documentation in watch mode

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Enable strict type checking
- Avoid `any` types when possible
- Export all public types and interfaces
- Use meaningful variable and function names

### Code Style

This project uses ESLint and Prettier for code style enforcement:

```bash
# Check formatting
pnpm lint:format

# Fix formatting issues
pnpm format

# Check linting
pnpm lint
```

### Type Definitions

- All API resources should have corresponding TypeScript interfaces
- Types should be exported from `src/types/index.ts`
- Use JSDoc comments for all public APIs

### Example Code Style

````typescript
/**
 * Fetches user information by user ID.
 *
 * @param userId - The Roblox user ID
 * @returns User information
 * @throws {OpenCloudError} If the API request fails
 *
 * @example
 * ```typescript
 * const user = await client.users.get("123456789");
 * console.log(user.displayName);
 * ```
 */
async get(userId: string): Promise<User> {
  // Implementation
}
````

## Testing

### Writing Tests

- Place tests in the `test/` directory
- Use descriptive test names that explain what is being tested
- Follow the Arrange-Act-Assert pattern
- Mock external API calls
- Use the utilities in `test/_utils.ts` for common test setup

### Test Structure

```typescript
import { describe, it, expect } from "vitest";

describe("Feature Name", () => {
  it("should do something specific", () => {
    // Arrange
    const input = "test";

    // Act
    const result = functionToTest(input);

    // Assert
    expect(result).toBe("expected");
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm coverage
```

### Coverage Requirements

- Aim for high test coverage (>80%)
- All new features must include tests
- Bug fixes should include regression tests

## Documentation

### Code Documentation

- Use JSDoc comments for all public APIs
- Include parameter descriptions, return types, and examples
- Document error cases with `@throws`

### TypeDoc

This project uses TypeDoc to generate documentation:

```bash
# Generate documentation
pnpm docs

# Generate documentation in watch mode
pnpm docs:watch
```

## Submitting Changes

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Maintenance tasks

Examples:

```
feat(users): add getUserInventory method

fix(http): handle rate limiting correctly

docs: update contributing guidelines
```

### Pull Request Process

1. **Update your branch** with the latest changes from upstream:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run the full test suite**:

   ```bash
   pnpm typecheck
   pnpm lint
   pnpm test
   pnpm build
   ```

3. **Push your changes**:

   ```bash
   git push origin your-branch-name
   ```

4. **Create a Pull Request** on GitHub:
   - Provide a clear title and description
   - Reference any related issues
   - Explain what changes you made and why
   - Include screenshots or examples if applicable

5. **Address review feedback**:
   - Respond to all comments
   - Make requested changes
   - Push additional commits to your branch

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows the project's style guidelines
- [ ] Tests have been added/updated and pass
- [ ] Documentation has been updated
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Commit messages follow conventions
- [ ] PR description clearly explains the changes

## Release Process

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated releases. The release process is handled automatically based on commit messages:

- `fix:` commits trigger patch releases (1.0.x)
- `feat:` commits trigger minor releases (1.x.0)
- `BREAKING CHANGE:` in commit body triggers major releases (x.0.0)

Contributors don't need to worry about versioning - it's handled automatically when PRs are merged to main.

## Getting Help

If you have questions or need help:

1. Check existing [issues](https://github.com/relatiocc/opencloud/issues)
2. Review the [documentation](https://opencloud.relatio.cc)
3. Open a new issue with your question

## Recognition

Contributors will be recognized in:

- The project's README
- GitHub's contributor graph

Thank you for contributing to `@relatiohq/opencloud`! 🚀
