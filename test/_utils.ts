export type MockResponse = {
  status: number;
  headers?: Record<string, string>;
  body?: unknown;
};

export function makeFetchMock(
  sequence:
    | MockResponse[]
    | ((url: URL, init?: RequestInit, call?: number) => MockResponse),
) {
  const calls: { url: URL; init?: RequestInit }[] = [];
  let i = 0;

  const fetchMock = (async (
    input: string | URL | Request,
    init?: RequestInit,
  ): Promise<Response> => {
    const url = new URL(
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url,
    );
    calls.push({ url, init });

    const spec =
      typeof sequence === "function"
        ? sequence(url, init, i++)
        : sequence[Math.min(i++, sequence.length - 1)];

    const headers = new Headers(
      spec?.headers ?? { "content-type": "application/json" },
    );
    const body =
      spec?.body === undefined ? undefined : JSON.stringify(spec.body);

    return new Response(body, { status: spec?.status, headers });
  }) as unknown as typeof fetch;

  return { fetchMock, calls };
}
