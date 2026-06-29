// React'dan tashqarida ham o'qiladigan oddiy module-level token store.
// instanceAuth interceptor buni sinxron o'qiydi (getSession network'isiz).

let accessToken: string | null = null;
let sessionResolved = false; // useSession "loading" tugaganmi?

export function setAccessToken(token: string | null) {
  accessToken = token;
  sessionResolved = true;
}

export function getCachedToken(): string | null {
  return accessToken;
}

export function isSessionResolved(): boolean {
  return sessionResolved;
}
