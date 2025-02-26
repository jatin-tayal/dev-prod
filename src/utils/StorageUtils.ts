/**
 * Type-safe localStorage wrapper with serialization/deserialization
 */

export interface StorageOptions {
  prefix?: string;
  serializer?: <T>(value: T) => string;
  deserializer?: <T>(value: string) => T;
}

const defaultSerializer = <T>(value: T): string => {
  return JSON.stringify(value);
};

const defaultDeserializer = <T>(value: string): T => {
  return JSON.parse(value) as T;
};

class StorageUtils {
  private prefix: string;
  private serializer: <T>(value: T) => string;
  private deserializer: <T>(value: string) => T;

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || 'dev-prod-';
    this.serializer = options.serializer || defaultSerializer;
    this.deserializer = options.deserializer || defaultDeserializer;
  }

  /**
   * Get a value from localStorage
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const prefixedKey = this.prefix + key;
      const storedValue = localStorage.getItem(prefixedKey);
      
      if (storedValue === null) {
        return defaultValue;
      }
      
      return this.deserializer<T>(storedValue);
    } catch (error) {
      console.error(`Error getting value from localStorage for key ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Set a value in localStorage
   */
  set<T>(key: string, value: T): boolean {
    try {
      const prefixedKey = this.prefix + key;
      const serializedValue = this.serializer(value);
      
      localStorage.setItem(prefixedKey, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error setting value in localStorage for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove a value from localStorage
   */
  remove(key: string): boolean {
    try {
      const prefixedKey = this.prefix + key;
      localStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error(`Error removing value from localStorage for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if a key exists in localStorage
   */
  has(key: string): boolean {
    const prefixedKey = this.prefix + key;
    return localStorage.getItem(prefixedKey) !== null;
  }

  /**
   * Get all keys in localStorage that match the prefix
   */
  keys(): string[] {
    const keys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.slice(this.prefix.length));
      }
    }
    
    return keys;
  }

  /**
   * Clear all items with the current prefix
   */
  clear(): void {
    const keysToRemove = this.keys();
    
    for (const key of keysToRemove) {
      this.remove(key);
    }
  }

  /**
   * Get the size of all items with the current prefix (in bytes)
   */
  size(): number {
    let totalSize = 0;
    
    for (const key of this.keys()) {
      const prefixedKey = this.prefix + key;
      const item = localStorage.getItem(prefixedKey);
      
      if (item) {
        // Key length + value length in UTF-16 (2 bytes per character)
        totalSize += (prefixedKey.length + item.length) * 2;
      }
    }
    
    return totalSize;
  }
}

// Create a default instance
const storage = new StorageUtils();

export default storage;
