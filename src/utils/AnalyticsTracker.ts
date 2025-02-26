export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp?: number;
  properties?: Record<string, any>;
}

const ANALYTICS_STORAGE_KEY = 'dev-prod-analytics';
const SESSION_ID_KEY = 'dev-prod-session-id';
const MAX_EVENTS = 100;
const ANALYTICS_ENABLED_KEY = 'analytics-enabled';

/**
 * Simple analytics tracking system that stores events locally
 * This is a placeholder for a real analytics system
 */
class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private enabled: boolean;
  
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.loadFromStorage();
    this.enabled = localStorage.getItem(ANALYTICS_ENABLED_KEY) !== 'false';
  }

  /**
   * Track an analytics event
   */
  track(event: Omit<AnalyticsEvent, 'timestamp'>): void {
    if (!this.enabled) return;

    const completeEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.events.push(completeEvent);
    
    // Limit the number of stored events
    if (this.events.length > MAX_EVENTS) {
      this.events = this.events.slice(-MAX_EVENTS);
    }

    this.saveToStorage();
    
    // Log event in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', completeEvent);
    }
  }

  /**
   * Track a page view
   */
  trackPageView(pageName: string, path: string): void {
    this.track({
      category: 'pageview',
      action: 'view',
      label: pageName,
      properties: { path }
    });
  }

  /**
   * Track a utility usage
   */
  trackUtilityUsage(utilityId: string, utilityName: string): void {
    this.track({
      category: 'utility',
      action: 'use',
      label: utilityName,
      properties: { utilityId }
    });
  }

  /**
   * Track an error event
   */
  trackError(errorType: string, errorMessage: string, details?: Record<string, any>): void {
    this.track({
      category: 'error',
      action: 'encounter',
      label: errorType,
      properties: {
        message: errorMessage,
        ...details
      }
    });
  }

  /**
   * Get all tracked events
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Clear all tracked events
   */
  clearEvents(): void {
    this.events = [];
    this.saveToStorage();
  }

  /**
   * Get events for a specific category
   */
  getEventsByCategory(category: string): AnalyticsEvent[] {
    return this.events.filter(event => event.category === category);
  }

  /**
   * Get events within a time range
   */
  getEventsByTimeRange(startTime: number, endTime: number): AnalyticsEvent[] {
    return this.events.filter(
      event => event.timestamp! >= startTime && event.timestamp! <= endTime
    );
  }

  /**
   * Enable or disable analytics tracking
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem(ANALYTICS_ENABLED_KEY, enabled ? 'true' : 'false');
  }

  /**
   * Check if analytics tracking is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get or create a session ID
   */
  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    
    return sessionId;
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  /**
   * Load events from localStorage
   */
  private loadFromStorage(): void {
    try {
      const storedEvents = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (storedEvents) {
        this.events = JSON.parse(storedEvents);
      }
    } catch (error) {
      console.error('Failed to load analytics events from storage:', error);
      this.events = [];
    }
  }

  /**
   * Save events to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.error('Failed to save analytics events to storage:', error);
      
      // If storage fails (e.g., quota exceeded), reduce the number of events
      if (this.events.length > 10) {
        this.events = this.events.slice(-10);
        try {
          localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(this.events));
        } catch {
          // If still failing, give up
        }
      }
    }
  }
}

// Create a singleton instance
const analytics = new AnalyticsTracker();

export default analytics;
