import { describe, it, expect } from "vitest";
import { generateIdempotencyKey } from "../src/utils/idempotency";

describe("generateIdempotencyKey", () => {
  it("should generate a unique key", () => {
    const key1 = generateIdempotencyKey();
    const key2 = generateIdempotencyKey();

    expect(key1).not.toBe(key2);
  });

  it("should return a string in the correct format", () => {
    const key = generateIdempotencyKey();

    // Format: {timestamp}-{hex1}-{hex2}-{hex3}-{hex4}
    const parts = key.split("-");

    expect(parts).toHaveLength(5);

    // First part should be a timestamp (numeric)
    expect(Number(parts[0])).toBeGreaterThan(0);
    expect(Number(parts[0])).toBeLessThanOrEqual(Date.now());

    // Next 4 parts should be 4-character hex strings
    for (let i = 1; i < 5; i++) {
      expect(parts[i]).toMatch(/^[0-9a-f]{4}$/);
    }
  });

  it("should generate multiple unique keys", () => {
    const keys = new Set<string>();
    const count = 1000;

    for (let i = 0; i < count; i++) {
      keys.add(generateIdempotencyKey());
    }

    // All keys should be unique
    expect(keys.size).toBe(count);
  });

  it("should include current timestamp", () => {
    const beforeTimestamp = Date.now();
    const key = generateIdempotencyKey();
    const afterTimestamp = Date.now();

    const keyTimestamp = Number(key.split("-")[0]);

    expect(keyTimestamp).toBeGreaterThanOrEqual(beforeTimestamp);
    expect(keyTimestamp).toBeLessThanOrEqual(afterTimestamp);
  });
});
