import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      exclude: [
        "src/docs/.vitepress/**",
        "scripts/**",
        "coverage/**",
        "dist/**",
        "node_modules/**",
        "test/**",
        "**/*.config.*",
        "**/*.d.ts",
      ],
    },
    exclude: ["dist/**", "node_modules/**", "docs/**", "coverage/**"],
  },
});
