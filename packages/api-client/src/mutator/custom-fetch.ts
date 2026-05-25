const getBaseUrl = () => {
  // Next.js runtime
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Vite runtime
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL as string;
  }
  return 'http://localhost:9999';
};

export interface ApiError extends Error {
  status: number;
  data?: unknown;
}

// Orval passes the first argument as a structured object, not a plain string + RequestInit.
// The second argument (options) is for consumer-level request overrides - rarely used.
export const customFetch = async <T>(
  {
    url,
    method,
    headers,
    data,
    params,
    signal,
  }: {
    url: string;
    method: string;
    headers?: HeadersInit;
    data?: unknown;
    params?: Record<string, unknown>;
    signal?: AbortSignal;
  },
  _options?: unknown,
): Promise<T> => {
  let fullUrl = `${getBaseUrl()}${url}`;

  if (params) {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') {
        query.set(k, String(v));
      }
    }
    const qs = query.toString();
    if (qs) fullUrl += `?${qs}`;
  }

  // FormData must be passed as-is so the browser can set the correct
  // multipart/form-data boundary. For everything else, JSON-encode the body.
  const isFormData = data instanceof FormData;

  const res = await fetch(fullUrl, {
    method,
    // Let the browser auto-set Content-Type (with boundary) for FormData;
    // use application/json for all other requests.
    headers: isFormData
      ? undefined
      : {
          'Content-Type': 'application/json',
          ...(headers as Record<string, string> | undefined),
        },
    credentials: 'include',
    body: isFormData ? data : data !== undefined ? JSON.stringify(data) : undefined,
    signal,
  });

  if (!res.ok) {
    let responseData: unknown;
    try {
      responseData = await res.json();
    } catch {
      // ignore
    }
    const err = new Error(`API ${res.status}: ${res.statusText}`) as ApiError;
    err.status = res.status;
    err.data = responseData;
    throw err;
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return res.json() as Promise<T>;
};

export default customFetch;
