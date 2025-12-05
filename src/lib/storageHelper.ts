 // ...existing code...
/**
 * Simple storage helper with TTL, local/session fallback and in-memory fallback.
 * Usage:
 *  await saveData('foo', { a: 1 }, { storage: 'local', ttl: 60_000 });
 *  const v = getData<{ a: number }>('foo');
 *  remove('foo');
 *  removeAll(); // clears all keys created by this helper
 */

type StorageType = "local" | "session";
type StoredPayload<T> = { value: T; expiresAt?: number | null };

const PREFIX = "confinity:"; // change if you want a namespace

const memory = new Map<string, string>();

function storageAvailable(type: StorageType): boolean {
  try {
    const storage = type === "local" ? window.localStorage : window.sessionStorage;
    const testKey = "__st_test__";
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function keyFor(k: string) {
  return `${PREFIX}${k}`;
}

export function saveData<T>(
  key: string,
  value: T,
  opts?: { ttl?: number; storage?: StorageType }
): void {
  const { ttl, storage = "local" } = opts || {};
  const expiresAt = typeof ttl === "number" ? Date.now() + ttl : null;
  const payload: StoredPayload<T> = { value, expiresAt };
  const raw = JSON.stringify(payload);

  if (storageAvailable(storage)) {
    const s = storage === "local" ? window.localStorage : window.sessionStorage;
    s.setItem(keyFor(key), raw);
    return;
  }else{
    console.log('errprr ');
  }

  memory.set(keyFor(key), raw);
}

export function getData<T = any>(key: string): T | null {
  const k = keyFor(key);
  let raw: string | null = null;

  if (storageAvailable("local")) {
    raw = window.localStorage.getItem(k);
    if (raw === null && storageAvailable("session")) raw = window.sessionStorage.getItem(k);
  } else {
    raw = memory.get(k) ?? null;
  }

  if (!raw) return null;

  try {
    const payload = JSON.parse(raw) as StoredPayload<T>;
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      // expired
      remove(key);
      return null;
    }
    return payload.value;
  } catch {
    // corrupted → remove
    remove(key);
    return null;
  }
}

export function remove(key: string): void {
  const k = keyFor(key);
  if (storageAvailable("local")) {
    window.localStorage.removeItem(k);
    window.sessionStorage.removeItem(k);
  } else {
    memory.delete(k);
  }
}

export function removeAll(): void {
  if (storageAvailable("local")) {
    // remove keys with prefix
    const removeWithPrefix = (s: Storage) => {
      const toRemove: string[] = [];
      for (let i = 0; i < s.length; i++) {
        const k = s.key(i);
        if (k && k.startsWith(PREFIX)) toRemove.push(k);
      }
      toRemove.forEach((k) => s.removeItem(k));
    };
    removeWithPrefix(window.localStorage);
    removeWithPrefix(window.sessionStorage);
  } else {
    for (const k of Array.from(memory.keys())) {
      if (k.startsWith(PREFIX)) memory.delete(k);
    }
  }
}

export function hasKey(key: string): boolean {
  const k = keyFor(key);
  if (storageAvailable("local")) {
    return !!window.localStorage.getItem(k) || !!window.sessionStorage.getItem(k);
  }
  return memory.has(k);
}