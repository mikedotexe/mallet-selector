import type { StorageService } from "./storage.service.types.js";

export class WebStorageService implements StorageService {
  getItem(key: string): Promise<string | null> {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        // We're on the server; return null.
        resolve(null);
        return;
      }
      const value = localStorage.getItem(key);
      resolve(value);
    });
  }

  setItem(key: string, value: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve();
        return;
      }
      localStorage.setItem(key, value);
      resolve();
    });
  }

  removeItem(key: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve();
        return;
      }
      localStorage.removeItem(key);
      resolve();
    });
  }
}
