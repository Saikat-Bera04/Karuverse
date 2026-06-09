export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const getToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem("karuverse_jwt");

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = {
    ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...authHeaders(),
    ...(init.headers || {})
  };

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data as T;
}

export const ipfsToGateway = (uri?: string) => {
  if (!uri) return "";
  if (!uri.startsWith("ipfs://")) return uri;
  return `https://gateway.pinata.cloud/ipfs/${uri.replace("ipfs://", "")}`;
};
