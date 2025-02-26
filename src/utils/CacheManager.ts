export interface CacheEntry<T> {
  value: T;
  expires: number | null; // Timestamp when the entry expires, null for no expiration
  created: number; // Timestamp when the entry was created
}

export interface CacheOptions {
  namespace?: string;
  defaultTTL?: number; // Time to live in milliseconds, default is 1 hour
}

/**
 * Cache manager for expensive operations
 * Uses localStorage for persistence across sessions
 */
class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private namespace: string;
  private defaultTTL: number;
  private storageKey: string;

  constructor(options: CacheOptions = {}) {
    this.namespace = options.namespace || 'app-cache';
    this.defaultTTL = options.defaultTTL || 60 * 60 * 1000; // 1 hour in milliseconds
    this.storageKey = `${this.namespace}-cache-store`;
    this.loadFromStorage();
  }

  /**
   * Set a value in the cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const expires = ttl !== undefined
      ? (ttl === 0 ? null : Date.now() + ttl)
      : (this.defaultTTL === 0 ? null : Date.now() + this.defaultTTL);

    const entry: CacheEntry<T> = {
      value,
      expires,
      created: Date.now()
    };

    this.cache.set(this.getNamespacedKey(key), entry);
    this.saveToStorage();
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | undefined {
    const namespacedKey = this.getNamespacedKey(key);
    const entry = this.cache.get(namespacedKey) as CacheEntry<T> | undefined;

    if (!entry) {
      return undefined;
    }

    // Check if the entry has expired
    if (entry.expires !== null && entry.expires < Date.now()) {
      this.cache.delete(namespacedKey);
      this.saveToStorage();
      return undefined;
    }

    return entry.value;
  }

  /**
   * Check if a key exists in the cache and is not expired
   */
  has(key: string): boolean {
    const namespacedKey = this.getNamespacedKey(key);
    const entry = this.cache.get(namespacedKey);

    if (!entry) {
      return false;
    }

    if (entry.expires !== null && entry.expires < Date.now()) {
      this.cache.delete(namespacedKey);
      this.saveToStorage();
      return false;
    }

    return true;
  }

  /**
   * Delete a value from the cache
   */
  delete(key: string): boolean {
    const result = this.cache.delete(this.getNamespacedKey(key));
    if (result) {
      this.saveToStorage();
    }
    return result;
  }

  /**
   * Remove all expired entries from the cache
   */
  prune(): number {
    let count = 0;
    const now = Date.now();

    // Use Array.from to avoid TypeScript errors with for..of loops on iterators
    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (entry.expires !== null && entry.expires < now) {
        this.cache.delete(key);
        count++;
      }
    });

    if (count > 0) {
      this.saveToStorage();
    }

    return count;
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  /**
   * Get all keys in the cache
   */
  keys(): string[] {
    this.prune(); // Remove expired entries before returning keys
    return Array.from(this.cache.keys()).map(key => this.removeNamespace(key));
  }

  /**
   * Get the total number of entries in the cache
   */
  size(): number {
    this.prune(); // Remove expired entries before returning size
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let expired = 0;
    let permanent = 0;
    let temporary = 0;
    let oldestEntry = Number.MAX_SAFE_INTEGER;
    let newestEntry = 0;

    // Use Array.from to avoid TypeScript errors with for..of loops on iterators
    Array.from(this.cache.values()).forEach(entry => {
      if (entry.expires === null) {
        permanent++;
      } else if (entry.expires < now) {
        expired++;
      } else {
        temporary++;
      }

      if (entry.created < oldestEntry) {
        oldestEntry = entry.created;
      }
      if (entry.created > newestEntry) {
        newestEntry = entry.created;
      }
    });

    return {
      total: this.cache.size,
      expired,
      permanent,
      temporary,
      oldestEntry: oldestEntry !== Number.MAX_SAFE_INTEGER ? new Date(oldestEntry) : null,
      newestEntry: newestEntry !== 0 ? new Date(newestEntry) : null
    };
  }

  /**
   * Memoize a function with cache
   */
  memoize<T, Args extends any[]>(
    fn: (...args: Args) => T,
    keyFn?: (...args: Args) => string,
    ttl?: number
  ): (...args: Args) => T {
    return (...args: Args): T => {
      const cacheKey = keyFn ? keyFn(...args) : JSON.stringify(args);
      
      if (this.has(cacheKey)) {
        return this.get<T>(cacheKey)!;
      }
      
      const result = fn(...args);
      this.set(cacheKey, result, ttl);
      return result;
    };
  }

  /**
   * Get a namespaced key
   */
  private getNamespacedKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  /**
   * Remove namespace from a key
   */
  private removeNamespace(namespacedKey: string): string {
    return namespacedKey.slice(this.namespace.length + 1);
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const cachedData = localStorage.getItem(this.storageKey);
      
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        this.cache = new Map(Object.entries(parsed));
        this.prune(); // Remove expired entries on load
      }
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
      this.cache = new Map();
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    try {
      // Convert Map to Object for JSON serialization
      const cacheObj = Object.fromEntries(this.cache.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(cacheObj));
    } catch (error) {
      console.error('Failed to save cache to storage:', error);
      
      // If we hit storage limits, clear old entries
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.pruneOldEntries(50); // Remove 50% of entries
        try {
          const cacheObj = Object.fromEntries(this.cache.entries());
          localStorage.setItem(this.storageKey, JSON.stringify(cacheObj));
        } catch {
          // If still failing, give up
        }
      }
    }
  }

  /**
   * Prune the oldest entries from the cache (by creation time)
   */
  private pruneOldEntries(percentToRemove: number): number {
    if (this.cache.size === 0) return 0;

    // Calculate how many entries to remove
    const entriesToRemove = Math.ceil(this.cache.size * (percentToRemove / 100));
    if (entriesToRemove <= 0) return 0;

    // Sort entries by creation time
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].created - b[1].created);

    // Remove the oldest entries
    const removed = entries.slice(0, entriesToRemove);
    removed.forEach(([key]) => this.cache.delete(key));

    return removed.length;
  }
}

// Create a default instance
const cacheManager = new CacheManager();

export default cacheManager;