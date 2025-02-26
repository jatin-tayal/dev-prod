/**
 * URL parameter serialization/deserialization for complex state
 */

// Available serializers
type SerializerType = 'json' | 'base64' | 'simple';

/**
 * Class for managing state serialization to/from URL parameters
 */
class UrlStateManager {
  /**
   * Serialize a value to a string for use in a URL
   */
  static serialize(value: any, type: SerializerType = 'simple'): string {
    switch (type) {
      case 'json':
        return this.jsonSerializer(value);
      case 'base64':
        return this.base64Serializer(value);
      case 'simple':
      default:
        return this.simpleSerializer(value);
    }
  }

  /**
   * Deserialize a string from a URL parameter to a value
   */
  static deserialize(value: string, type: SerializerType = 'simple'): any {
    if (!value) return null;
    
    switch (type) {
      case 'json':
        return this.jsonDeserializer(value);
      case 'base64':
        return this.base64Deserializer(value);
      case 'simple':
      default:
        return this.simpleDeserializer(value);
    }
  }

  /**
   * JSON serializer (compresses better than 'simple' for complex objects)
   */
  private static jsonSerializer(value: any): string {
    try {
      const jsonString = JSON.stringify(value);
      return encodeURIComponent(jsonString);
    } catch (error) {
      console.error('Error serializing to JSON:', error);
      return '';
    }
  }

  /**
   * JSON deserializer
   */
  private static jsonDeserializer(value: string): any {
    try {
      const jsonString = decodeURIComponent(value);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error deserializing from JSON:', error);
      return null;
    }
  }

  /**
   * Base64 serializer (good for binary data)
   */
  private static base64Serializer(value: any): string {
    try {
      const jsonString = JSON.stringify(value);
      return btoa(encodeURIComponent(jsonString));
    } catch (error) {
      console.error('Error serializing to Base64:', error);
      return '';
    }
  }

  /**
   * Base64 deserializer
   */
  private static base64Deserializer(value: string): any {
    try {
      const jsonString = decodeURIComponent(atob(value));
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error deserializing from Base64:', error);
      return null;
    }
  }

  /**
   * Simple serializer (works well for primitive values)
   */
  private static simpleSerializer(value: any): string {
    if (value === undefined || value === null) {
      return '';
    }
    
    if (typeof value === 'string') {
      return encodeURIComponent(value);
    }
    
    if (typeof value === 'number' || typeof value === 'boolean') {
      return value.toString();
    }
    
    // For arrays and objects, use JSON
    try {
      return encodeURIComponent(JSON.stringify(value));
    } catch (error) {
      console.error('Error simple serializing complex object:', error);
      return '';
    }
  }

  /**
   * Simple deserializer
   */
  private static simpleDeserializer(value: string): any {
    if (value === '') {
      return null;
    }
    
    // Check if it's a number
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return parseFloat(value);
    }
    
    // Check if it's a boolean
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // Check if it's JSON
    if ((value.startsWith('%7B') && value.endsWith('%7D')) || // '{' and '}' URL encoded
        (value.startsWith('%5B') && value.endsWith('%5D'))) { // '[' and ']' URL encoded
      try {
        return JSON.parse(decodeURIComponent(value));
      } catch {
        // If parsing fails, return as string
        return decodeURIComponent(value);
      }
    }
    
    // Otherwise, it's a simple string
    return decodeURIComponent(value);
  }

  /**
   * Create a URL with state parameters
   */
  static createUrl(baseUrl: string, state: Record<string, any>, type: SerializerType = 'json'): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(state).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, this.serialize(value, type));
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  /**
   * Parse state from URL search parameters
   */
  static parseUrl(searchParamsString: string, type: SerializerType = 'json'): Record<string, any> {
    const result: Record<string, any> = {};
    const searchParams = new URLSearchParams(searchParamsString);
    
    // Use Array.from instead of for..of to avoid TypeScript errors with iterators
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      result[key] = this.deserialize(value, type);
    });
    
    return result;
  }

  /**
   * Create a sharable URL for the current page with state
   */
  static getShareableUrl(state: Record<string, any>, type: SerializerType = 'json'): string {
    return this.createUrl(window.location.href.split('?')[0], state, type);
  }

  /**
   * Copy a sharable URL to the clipboard
   */
  static copyShareableUrl(state: Record<string, any>, type: SerializerType = 'json'): boolean {
    try {
      const url = this.getShareableUrl(state, type);
      navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.error('Error copying URL to clipboard:', error);
      return false;
    }
  }
}

export default UrlStateManager;