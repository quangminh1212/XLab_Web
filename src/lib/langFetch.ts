export type Lang = 'eng' | 'vie';

// Normalize local language code to eng|vie
export const normalizeLang = (lang: string | null | undefined): Lang => {
  const l = (lang || '').toLowerCase();
  if (l.startsWith('en')) return 'eng';
  if (l.startsWith('vi')) return 'vie';
  if (l === 'eng' || l === 'vie') return l as Lang;
  return 'vie';
};

// Append lang query and set Accept-Language header consistently
export async function langFetch(input: string, init: RequestInit & { lang?: Lang } = {}) {
  const url = new URL(input, typeof window === 'undefined' ? 'http://localhost' : window.location.origin);

  const lang = init.lang || (typeof window !== 'undefined' ? (localStorage.getItem('language') as Lang | null) : null) || 'vie';
  if (!url.searchParams.has('lang')) {
    url.searchParams.set('lang', lang);
  }

  const headers = new Headers(init.headers || {});
  if (!headers.has('accept-language')) {
    headers.set('accept-language', lang);
  }

  const finalInit: RequestInit = {
    ...init,
    headers,
  };

  const res = await fetch(url.toString(), finalInit);
  const contentType = res.headers.get('content-type') || '';
  let payload: any = null;
  if (contentType.includes('application/json')) {
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
  }

  // Normalize common API shapes to a consistent result
  if (!res.ok) {
    const errorMessage = payload?.error || payload?.message || res.statusText || 'Request failed';
    throw new Error(errorMessage);
  }

  // If API already wraps { success, data }, return that; else wrap plain JSON
  if (payload && typeof payload === 'object' && ('success' in payload || 'data' in payload)) {
    return payload;
  }

  return { success: true, data: payload };
}

// React hook to use in client components
export function useLangFetch(currentLang?: Lang) {
  const lang = (currentLang || (typeof window !== 'undefined' ? (localStorage.getItem('language') as Lang | null) : null) || 'vie') as Lang;
  return (input: string, init: RequestInit = {}) => langFetch(input, { ...init, lang });
}

