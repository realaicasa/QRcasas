const TEABLE_BASE_URL = resolveTeableBaseUrl(process.env.TEABLE_API_URL);
const TEABLE_TOKEN = process.env.TEABLE_API_TOKEN ?? "";

/** Accept both the current API base and the legacy base/app URL supplied in deployment settings. */
function resolveTeableBaseUrl(value: string | undefined): string {
  const configured = value?.replace(/\/$/, "") ?? "";
  if (!configured) return "";

  try {
    const url = new URL(configured);
    if (url.hostname === "api.teable.io" || url.pathname.includes("/base/")) {
      return "https://app.teable.ai/api";
    }
  } catch {
    return configured;
  }

  return configured;
}

interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  retryOn: number[];
}

const DEFAULT_RETRY: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 15_000,
  retryOn: [429, 500, 502, 503, 504],
};

function jitter(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseRetryAfter(header: string | null, fallbackMs: number): number {
  if (!header) return fallbackMs;
  const seconds = Number(header);
  if (!Number.isFinite(seconds) || seconds <= 0) return fallbackMs;
  return Math.min(seconds * 1000, 30_000);
}

// Query deduplication: in-flight requests keyed by URL
const inflight = new Map<string, Promise<unknown>>();

export interface TeableFetchOptions extends RequestInit {
  retries?: Partial<RetryConfig>;
  /** When true, only retry on safe read methods (GET/HEAD). Default true. */
  safeOnly?: boolean;
  /** When true, deduplicate identical concurrent requests. Default true for GET. */
  dedupe?: boolean;
  /** Revalidate interval in seconds for Next.js fetch cache (catalog queries). */
  revalidate?: number;
}

export async function teableFetch<T>(
  path: string,
  options: TeableFetchOptions = {},
): Promise<T> {
  const {
    retries: overrides,
    safeOnly = false,
    dedupe,
    revalidate,
    ...fetchOpts
  } = options;

  const config = { ...DEFAULT_RETRY, ...overrides };
  const method = (fetchOpts.method ?? "GET").toUpperCase();
  const isSafeMethod = method === "GET" || method === "HEAD";
  const shouldRetry = isSafeMethod || !safeOnly;
  const shouldDedupe = dedupe ?? isSafeMethod;

  const url = path.startsWith("http") ? path : `${TEABLE_BASE_URL}${path}`;

  // Build fetch init
  const fetchInit: RequestInit = {
    ...fetchOpts,
    headers: {
      "Content-Type": "application/json",
      ...(TEABLE_TOKEN ? { Authorization: `Bearer ${TEABLE_TOKEN}` } : {}),
      ...fetchOpts.headers,
    },
  };

  // Next.js fetch cache for catalog queries
  if (revalidate !== undefined && isSafeMethod) {
    (fetchInit as RequestInit & { next?: { revalidate?: number } }).next = { revalidate };
  }

  const dedupeKey = shouldDedupe ? `${method}:${url}` : undefined;

  // Return existing in-flight request if deduplicating
  if (dedupeKey && inflight.has(dedupeKey)) {
    return inflight.get(dedupeKey) as Promise<T>;
  }

  const promise = executeWithRetry<T>(url, fetchInit, config, shouldRetry);

  if (dedupeKey) {
    inflight.set(dedupeKey, promise);
    promise.finally(() => inflight.delete(dedupeKey));
  }

  return promise;
}

async function executeWithRetry<T>(
  url: string,
  fetchInit: RequestInit,
  config: RetryConfig,
  shouldRetry: boolean,
): Promise<T> {
  let lastError: Error | null = null;
  const maxAttempts = shouldRetry ? config.maxRetries + 1 : 1;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      const retryAfterHeader = lastError instanceof TeableHttpError
        ? lastError.headers?.get("retry-after") ?? null
        : null;
      const baseDelay = parseRetryAfter(retryAfterHeader, config.baseDelayMs * Math.pow(2, attempt - 1));
      const delayMs = Math.min(jitter(baseDelay, baseDelay * 2), config.maxDelayMs);
      await new Promise((r) => setTimeout(r, delayMs));
    }

    try {
      const res = await fetch(url, fetchInit);

      if (!res.ok) {
        const err = new TeableHttpError(res.status, await res.text().catch(() => ""), res.headers);
        if (shouldRetry && config.retryOn.includes(res.status)) {
          lastError = err;
          continue;
        }
        throw err;
      }

      const text = await res.text();
      return text ? JSON.parse(text) : (undefined as T);
    } catch (err) {
      if (err instanceof TeableHttpError) {
        lastError = err;
        continue;
      }
      if (shouldRetry && attempt < maxAttempts - 1) {
        lastError = err instanceof Error ? err : new Error(String(err));
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new Error("Teable request failed after retries");
}

export class TeableHttpError extends Error {
  status: number;
  body: string;
  headers: Headers | null;

  constructor(status: number, body: string, headers: Headers | null = null) {
    super(`Teable HTTP ${status}`);
    this.name = "TeableHttpError";
    this.status = status;
    this.body = body;
    this.headers = headers;
  }
}

export function isSafeWriteAllowed(): boolean {
  return process.env.TEABLE_ALLOW_WRITE !== "false";
}

/**
 * Build an absolute canonical URL for the site.
 * Falls back to relative path if SITE_URL is not set.
 */
export function absoluteUrl(path: string): string {
  const base = process.env.SITE_URL ?? "https://qrcasas.com";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
