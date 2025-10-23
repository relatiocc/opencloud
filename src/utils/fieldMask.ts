export type DeepPartialWithNull<T> = {
  [K in keyof T]?: T[K] extends object
    ? DeepPartialWithNull<T[K]> | null
    : T[K] | null;
};

export function buildFieldMask<T extends object>(
  body: DeepPartialWithNull<T>,
): string {
  const paths: string[] = [];

  function visit(value: unknown, parent: string | null): void {
    if (value === null || typeof value !== "object") return;

    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (val === undefined) continue;
      const path = parent ? `${parent}.${key}` : key;

      if (val === null) {
        paths.push(path);
        continue;
      }

      if (Array.isArray(val)) {
        paths.push(path);
        continue;
      }

      if (typeof val === "object") {
        const before = paths.length;
        visit(val, path);
        if (paths.length === before) paths.push(path);
        continue;
      }

      paths.push(path);
    }
  }

  visit(body, null);
  return paths.join(",");
}
