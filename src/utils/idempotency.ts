/**
 * Generates a unique idempotency key using timestamp and random values.
 *
 * Format: `{timestamp}-{random1}-{random2}-{random3}-{random4}`
 * Example: `1730073600000-a3f9-b2c8-d4e1-f5a7`
 *
 * @returns A unique idempotency key string
 */
export function generateIdempotencyKey(): string {
  const timestamp = Date.now();

  const segments: string[] = [];
  for (let i = 0; i < 4; i++) {
    const randomValue = Math.floor(Math.random() * 0x10000);
    segments.push(randomValue.toString(16).padStart(4, "0"));
  }

  return `${timestamp}-${segments.join("-")}`;
}
