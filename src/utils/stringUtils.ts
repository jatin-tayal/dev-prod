/**
 * Utility functions for string manipulation
 */

export type StringFormatType =
  | "javascript"
  | "java"
  | "csharp"
  | "python"
  | "go"
  | "double-quotes"
  | "single-quotes";

/**
 * Escape a string for use in JavaScript code
 */
export function escapeForJavaScript(
  input: string,
  quoteType: "single" | "double" = "double"
): string {
  if (!input) return input;

  let result = input
    .replace(/\\/g, "\\\\") // Backslash
    .replace(/\t/g, "\\t") // Tab
    .replace(/\n/g, "\\n") // Newline
    .replace(/\r/g, "\\r") // Carriage return
    .replace(/\f/g, "\\f") // Form feed
    .replace(/\b/g, "\\b"); // Backspace

  if (quoteType === "double") {
    result = result.replace(/"/g, '\\"'); // Double quote
    return `"${result}"`;
  } else {
    result = result.replace(/'/g, "\\'"); // Single quote
    return `'${result}'`;
  }
}

/**
 * Escape a string for use in Java code
 */
export function escapeForJava(input: string): string {
  if (!input) return input;

  const result = input
    .replace(/\\/g, "\\\\") // Backslash
    .replace(/\t/g, "\\t") // Tab
    .replace(/\n/g, "\\n") // Newline
    .replace(/\r/g, "\\r") // Carriage return
    .replace(/\f/g, "\\f") // Form feed
    .replace(/\b/g, "\\b") // Backspace
    .replace(/"/g, '\\"'); // Double quote

  return `"${result}"`;
}

/**
 * Escape a string for use in C# code
 */
export function escapeForCSharp(input: string): string {
  if (!input) return input;

  const result = input
    .replace(/\\/g, "\\\\") // Backslash
    .replace(/\t/g, "\\t") // Tab
    .replace(/\n/g, "\\n") // Newline
    .replace(/\r/g, "\\r") // Carriage return
    .replace(/\f/g, "\\f") // Form feed
    .replace(/\b/g, "\\b") // Backspace
    .replace(/"/g, '\\"'); // Double quote

  return `"${result}"`;
}

/**
 * Escape a string for use in Python code
 */
export function escapeForPython(
  input: string,
  quoteType: "single" | "double" = "double"
): string {
  if (!input) return input;

  let result = input
    .replace(/\\/g, "\\\\") // Backslash
    .replace(/\t/g, "\\t") // Tab
    .replace(/\n/g, "\\n") // Newline
    .replace(/\r/g, "\\r") // Carriage return
    .replace(/\f/g, "\\f") // Form feed
    .replace(/\b/g, "\\b"); // Backspace

  if (quoteType === "double") {
    result = result.replace(/"/g, '\\"'); // Double quote
    return `"${result}"`;
  } else {
    result = result.replace(/'/g, "\\'"); // Single quote
    return `'${result}'`;
  }
}

/**
 * Escape a string for use in Go code
 */
export function escapeForGo(input: string): string {
  if (!input) return input;

  const result = input
    .replace(/\\/g, "\\\\") // Backslash
    .replace(/\t/g, "\\t") // Tab
    .replace(/\n/g, "\\n") // Newline
    .replace(/\r/g, "\\r") // Carriage return
    .replace(/\f/g, "\\f") // Form feed
    .replace(/\b/g, "\\b") // Backspace
    .replace(/"/g, '\\"'); // Double quote

  return `"${result}"`;
}

/**
 * Format a JSON string for a specific language
 */
export function formatJsonAsString(
  json: string,
  format: StringFormatType
): string {
  try {
    // First ensure it's valid JSON
    const obj = JSON.parse(json);
    const jsonString = JSON.stringify(obj);

    switch (format) {
      case "javascript":
        return `const jsonObject = ${jsonString};`;
      case "java":
        return `String jsonString = ${escapeForJava(jsonString)};`;
      case "csharp":
        return `string jsonString = ${escapeForCSharp(jsonString)};`;
      case "python":
        return `json_string = '''${jsonString}'''`;
      case "go":
        return `jsonString := \`${jsonString}\``;
      case "double-quotes":
        return escapeForJavaScript(jsonString);
      case "single-quotes":
        return escapeForJavaScript(jsonString, "single");
      default:
        return jsonString;
    }
  } catch (error) {
    throw new Error(
      `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Count characters and lines in a string
 */
export function countStats(text: string): {
  chars: number;
  lines: number;
  nonWhitespaceChars: number;
} {
  if (!text) {
    return { chars: 0, lines: 0, nonWhitespaceChars: 0 };
  }

  const chars = text.length;
  const lines = (text.match(/\n/g) || []).length + 1;
  const nonWhitespaceChars = text.replace(/\s/g, "").length;

  return { chars, lines, nonWhitespaceChars };
}
