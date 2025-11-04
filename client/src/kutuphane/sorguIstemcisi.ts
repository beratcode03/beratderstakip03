// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const sorguIstemcisi = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
      // Yinelenen istekleri önleyin
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Belirli veri türleri için optimizasyonlar
export const getQueryOptions = (key: string) => {
  const optimizations: Record<string, any> = {
    // Hava durumu verileri - 2 dakika önbellek VE daha güncel veriler
    '/api/weather': {
      staleTime: 2 * 60 * 1000, // 2 dakika
      cacheTime: 5 * 60 * 1000, // 5 dakika
    },
    // Takvim verileri - 1 dakika önbellek
    '/api/calendar': {
      staleTime: 1 * 60 * 1000, // 1 dakika
      cacheTime: 5 * 60 * 1000, // 5 dakika
    },
    // Flashcards - 30 saniye önbellek
    '/api/flashcards': {
      staleTime: 30 * 1000, // 30 saniye
      cacheTime: 2 * 60 * 1000, // 2 dakika
    },
    // Analytics verileri - daha agresif önbellekleme
    '/api/question-logs': {
      staleTime: 2 * 60 * 1000, // 2 dakika
      cacheTime: 5 * 60 * 1000, // 5 dakika
    },
    '/api/exam-results': {
      staleTime: 2 * 60 * 1000, // 2 dakika
      cacheTime: 5 * 60 * 1000, // 5 dakika   
    },
  };

  // Eşleşen optimizasyonu bul
  const matchedKey = Object.keys(optimizations).find(pattern => key.startsWith(pattern));
  return matchedKey ? optimizations[matchedKey] : {};
};

// BERAT BİLAL CANKIR
// BERAT CANKIR
// CANKIR
