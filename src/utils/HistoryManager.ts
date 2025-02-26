export interface HistoryEntry {
  id: string;
  path: string;
  title: string;
  timestamp: number;
  data?: Record<string, any>;
}

export type HistoryFilter = (entry: HistoryEntry) => boolean;

const HISTORY_STORAGE_KEY = 'dev-prod-history';
const DEFAULT_MAX_ENTRIES = 20;

/**
 * Utility class for tracking and managing utility usage history
 */
class HistoryManager {
  private history: HistoryEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries = DEFAULT_MAX_ENTRIES) {
    this.maxEntries = maxEntries;
    this.loadFromStorage();
  }

  /**
   * Add a new entry to the history
   */
  addEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): HistoryEntry {
    // Create a complete entry with generated id and timestamp
    const newEntry: HistoryEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      ...entry
    };

    // Check if similar entry exists (same path)
    const existingIndex = this.history.findIndex(e => e.path === entry.path);
    
    if (existingIndex !== -1) {
      // Update existing entry
      this.history[existingIndex] = {
        ...this.history[existingIndex],
        title: entry.title,
        timestamp: newEntry.timestamp,
        data: entry.data
      };
    } else {
      // Add new entry at the beginning
      this.history.unshift(newEntry);
      
      // Limit the number of entries
      if (this.history.length > this.maxEntries) {
        this.history = this.history.slice(0, this.maxEntries);
      }
    }

    this.saveToStorage();
    return existingIndex !== -1 ? this.history[existingIndex] : newEntry;
  }

  /**
   * Get all history entries, optionally filtered
   */
  getEntries(filter?: HistoryFilter): HistoryEntry[] {
    if (filter) {
      return this.history.filter(filter);
    }
    return [...this.history];
  }

  /**
   * Get recent entries, with optional limit
   */
  getRecentEntries(limit = 5): HistoryEntry[] {
    return this.history.slice(0, limit);
  }

  /**
   * Get a specific entry by id
   */
  getEntry(id: string): HistoryEntry | undefined {
    return this.history.find(entry => entry.id === id);
  }

  /**
   * Remove a specific entry by id
   */
  removeEntry(id: string): boolean {
    const initialLength = this.history.length;
    this.history = this.history.filter(entry => entry.id !== id);
    
    if (this.history.length !== initialLength) {
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  /**
   * Clear all history entries
   */
  clearHistory(): void {
    this.history = [];
    this.saveToStorage();
  }

  /**
   * Generate a unique id for a history entry
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  /**
   * Load history from localStorage
   */
  private loadFromStorage(): void {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        this.history = JSON.parse(storedHistory);
      }
    } catch (error) {
      console.error('Failed to load history from storage:', error);
      this.history = [];
    }
  }

  /**
   * Save history to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history));
    } catch (error) {
      console.error('Failed to save history to storage:', error);
    }
  }
}

// Create a singleton instance
const historyManager = new HistoryManager();

export default historyManager;
