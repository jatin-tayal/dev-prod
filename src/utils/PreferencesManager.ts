export interface PreferenceOptions<T> {
  category?: string;
  defaultValue?: T;
  validate?: (value: T) => boolean;
}

const PREFERENCES_STORAGE_KEY = "dev-prod-preferences";

/**
 * Utility class for managing user preferences
 */
class PreferencesManager {
  private preferences: Record<string, any> = {};

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Set a preference value
   */
  set<T>(key: string, value: T, options: PreferenceOptions<T> = {}): boolean {
    const { category, validate } = options;
    const fullKey = category ? `${category}.${key}` : key;

    // Validate if validation function is provided
    if (validate && !validate(value)) {
      console.warn(`Invalid preference value for ${fullKey}`);
      return false;
    }

    // Set the preference
    this.setNestedProperty(this.preferences, fullKey, value);
    this.saveToStorage();
    return true;
  }

  /**
   * Get a preference value
   */
  get<T>(key: string, options: PreferenceOptions<T> = {}): T {
    const { category, defaultValue } = options;
    const fullKey = category ? `${category}.${key}` : key;

    // Get the preference or return default
    const value = this.getNestedProperty(this.preferences, fullKey);
    return value !== undefined ? value : (defaultValue as T);
  }

  /**
   * Check if a preference exists
   */
  has(key: string, category?: string): boolean {
    const fullKey = category ? `${category}.${key}` : key;
    return this.getNestedProperty(this.preferences, fullKey) !== undefined;
  }

  /**
   * Remove a preference
   */
  remove(key: string, category?: string): void {
    const fullKey = category ? `${category}.${key}` : key;
    this.removeNestedProperty(this.preferences, fullKey);
    this.saveToStorage();
  }

  /**
   * Get all preferences for a category
   */
  getCategory(category: string): Record<string, any> {
    return this.getNestedProperty(this.preferences, category) || {};
  }

  /**
   * Remove all preferences in a category
   */
  removeCategory(category: string): void {
    delete this.preferences[category];
    this.saveToStorage();
  }

  /**
   * Reset all preferences
   */
  resetAll(): void {
    this.preferences = {};
    this.saveToStorage();
  }

  /**
   * Set multiple preferences at once
   */
  setMultiple(preferences: Record<string, any>, category?: string): void {
    if (category) {
      // Set for specific category
      this.preferences[category] = {
        ...this.getCategory(category),
        ...preferences,
      };
    } else {
      // Set at root level
      Object.entries(preferences).forEach(([key, value]) => {
        this.setNestedProperty(this.preferences, key, value);
      });
    }

    this.saveToStorage();
  }

  /**
   * Import preferences from a JSON string
   */
  import(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      this.preferences = data;
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error("Failed to import preferences:", error);
      return false;
    }
  }

  /**
   * Export preferences as a JSON string
   */
  export(): string {
    return JSON.stringify(this.preferences);
  }

  /**
   * Load preferences from localStorage
   */
  private loadFromStorage(): void {
    try {
      const storedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (storedPreferences) {
        this.preferences = JSON.parse(storedPreferences);
      }
    } catch (error) {
      console.error("Failed to load preferences from storage:", error);
      this.preferences = {};
    }
  }

  /**
   * Save preferences to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(
        PREFERENCES_STORAGE_KEY,
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error("Failed to save preferences to storage:", error);
    }
  }

  /**
   * Set a nested property using a dot-notation string
   */
  private setNestedProperty(
    obj: Record<string, any>,
    path: string,
    value: any
  ): void {
    const parts = path.split(".");
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];

      if (!(part in current)) {
        current[part] = {};
      }

      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
  }

  /**
   * Get a nested property using a dot-notation string
   */
  private getNestedProperty(obj: Record<string, any>, path: string): any {
    const parts = path.split(".");
    let current = obj;

    for (const part of parts) {
      if (current === undefined || current === null) {
        return undefined;
      }

      current = current[part];
    }

    return current;
  }

  /**
   * Remove a nested property using a dot-notation string
   */
  private removeNestedProperty(obj: Record<string, any>, path: string): void {
    const parts = path.split(".");
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];

      if (!(part in current)) {
        return;
      }

      current = current[part];
    }

    delete current[parts[parts.length - 1]];
  }
}

// Create a singleton instance
const preferencesManager = new PreferencesManager();

export default preferencesManager;
