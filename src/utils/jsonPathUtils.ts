/**
 * Simple JSONPath implementation for evaluating paths in JSON objects
 */

export interface JSONPathResult {
  path: string;
  value: any;
  parent?: any;
  parentProperty?: string;
}

/**
 * Evaluate a JSONPath expression against a JSON object
 * @param obj The JSON object to query
 * @param path The JSONPath expression (e.g., '$.store.book[0].title')
 * @returns Array of matches with their paths and values
 */
export function evaluateJSONPath(obj: any, path: string): JSONPathResult[] {
  // Handle empty/invalid input
  if (!obj || !path) {
    return [];
  }

  // Normalize path: remove whitespace and handle different root notation
  const normalizedPath = path.trim();

  if (
    !normalizedPath.startsWith("$") &&
    !normalizedPath.startsWith("..") &&
    !normalizedPath.startsWith("[")
  ) {
    return [];
  }

  try {
    // Implement basic JSONPath parsing and evaluation
    return evaluatePath(obj, normalizedPath);
  } catch (error) {
    console.error("Error evaluating JSONPath:", error);
    return [];
  }
}

/**
 * Recursive function to evaluate a JSONPath expression
 */
function evaluatePath(
  obj: any,
  path: string,
  currentPath: string = "$",
  results: JSONPathResult[] = []
): JSONPathResult[] {
  // Base case: empty path
  if (!path || path === "$") {
    results.push({
      path: currentPath,
      value: obj,
    });
    return results;
  }

  // Handle root reference
  if (path.startsWith("$")) {
    return evaluatePath(obj, path.substring(1), currentPath, results);
  }

  // Handle property access with dot notation
  if (path.startsWith(".")) {
    const remainingPath = path.substring(1);

    // Handle dot-dot notation (recursive descent)
    if (remainingPath.startsWith(".")) {
      return evaluateRecursiveDescent(
        obj,
        remainingPath.substring(1),
        currentPath,
        results
      );
    }

    // Extract property name
    let propName: string;
    let restPath: string;

    // Handle cases like .prop[...] or .prop.rest
    const dotIndex = remainingPath.indexOf(".", 1);
    const bracketIndex = remainingPath.indexOf("[", 1);

    if (dotIndex > 0 && (bracketIndex < 0 || dotIndex < bracketIndex)) {
      propName = remainingPath.substring(0, dotIndex);
      restPath = remainingPath.substring(dotIndex);
    } else if (bracketIndex > 0) {
      propName = remainingPath.substring(0, bracketIndex);
      restPath = remainingPath.substring(bracketIndex);
    } else {
      propName = remainingPath;
      restPath = "";
    }

    // Handle wildcards
    if (propName === "*") {
      if (typeof obj === "object" && obj !== null) {
        Object.keys(obj).forEach((key) => {
          const newPath = `${currentPath}.${key}`;
          evaluatePath(obj[key], restPath, newPath, results);
        });
      }
      return results;
    }

    // Regular property access
    if (typeof obj === "object" && obj !== null && propName in obj) {
      const newPath = `${currentPath}.${propName}`;
      return evaluatePath(obj[propName], restPath, newPath, results);
    }

    return results;
  }

  // Handle array or object subscripting with bracket notation
  if (path.startsWith("[")) {
    const closingBracket = path.indexOf("]");
    if (closingBracket < 0) {
      return results; // Invalid path
    }

    const insideBrackets = path.substring(1, closingBracket);
    const restPath = path.substring(closingBracket + 1);

    // Handle array index
    if (/^\d+$/.test(insideBrackets)) {
      const index = parseInt(insideBrackets, 10);
      if (Array.isArray(obj) && index >= 0 && index < obj.length) {
        const newPath = `${currentPath}[${index}]`;
        return evaluatePath(obj[index], restPath, newPath, results);
      }
    }

    // Handle array slice [start:end]
    if (insideBrackets.includes(":")) {
      const [startStr, endStr] = insideBrackets.split(":");
      const start = startStr ? parseInt(startStr, 10) : 0;
      const end = endStr
        ? parseInt(endStr, 10)
        : Array.isArray(obj)
        ? obj.length
        : 0;

      if (Array.isArray(obj)) {
        for (let i = start; i < Math.min(end, obj.length); i++) {
          const newPath = `${currentPath}[${i}]`;
          evaluatePath(obj[i], restPath, newPath, results);
        }
      }

      return results;
    }

    // Handle wildcard [*]
    if (insideBrackets === "*") {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          const newPath = `${currentPath}[${index}]`;
          evaluatePath(item, restPath, newPath, results);
        });
      } else if (typeof obj === "object" && obj !== null) {
        Object.keys(obj).forEach((key) => {
          const newPath = `${currentPath}['${key}']`;
          evaluatePath(obj[key], restPath, newPath, results);
        });
      }

      return results;
    }

    // Handle property name in quotes
    const quotedMatch = insideBrackets.match(/^(['"])(.*?)\1$/);
    if (quotedMatch) {
      const key = quotedMatch[2];
      if (typeof obj === "object" && obj !== null && key in obj) {
        const newPath = `${currentPath}['${key}']`;
        return evaluatePath(obj[key], restPath, newPath, results);
      }
    }

    // Handle filter expressions - Very basic implementation for [?(@.property==value)]
    if (insideBrackets.startsWith("?(") && insideBrackets.endsWith(")")) {
      const filterExpr = insideBrackets.substring(2, insideBrackets.length - 1);

      // Simple equality filter
      const equalityMatch = filterExpr.match(
        /@\.([a-zA-Z0-9_]+)(==|!=|>|<|>=|<=)(.+)/
      );
      if (equalityMatch) {
        const [, prop, operator, valueStr] = equalityMatch;
        let targetValue: any;

        // Try to parse the value
        try {
          // Handle quoted strings
          if (
            (valueStr.startsWith("'") && valueStr.endsWith("'")) ||
            (valueStr.startsWith('"') && valueStr.endsWith('"'))
          ) {
            targetValue = valueStr.substring(1, valueStr.length - 1);
          } else if (valueStr === "true") {
            targetValue = true;
          } else if (valueStr === "false") {
            targetValue = false;
          } else if (valueStr === "null") {
            targetValue = null;
          } else if (!isNaN(Number(valueStr))) {
            targetValue = Number(valueStr);
          } else {
            targetValue = valueStr;
          }
        } catch {
          targetValue = valueStr;
        }

        // Apply filter based on operator
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            if (typeof item === "object" && item !== null && prop in item) {
              let matches = false;

              switch (operator) {
                case "==":
                  matches = item[prop] == targetValue;
                  break;
                case "!=":
                  matches = item[prop] != targetValue;
                  break;
                case ">":
                  matches = item[prop] > targetValue;
                  break;
                case "<":
                  matches = item[prop] < targetValue;
                  break;
                case ">=":
                  matches = item[prop] >= targetValue;
                  break;
                case "<=":
                  matches = item[prop] <= targetValue;
                  break;
                default:
                  matches = false;
              }

              if (matches) {
                const newPath = `${currentPath}[${index}]`;
                evaluatePath(item, restPath, newPath, results);
              }
            }
          });
        }
      }

      return results;
    }

    return results;
  }

  return results;
}

/**
 * Handle recursive descent (..) in JSONPath
 */
function evaluateRecursiveDescent(
  obj: any,
  path: string,
  currentPath: string,
  results: JSONPathResult[]
): JSONPathResult[] {
  // Extract property name to search for recursively
  let propName: string;
  let restPath: string;

  // Extract the property name and remaining path
  const dotIndex = path.indexOf(".");
  const bracketIndex = path.indexOf("[");

  if (dotIndex > 0 && (bracketIndex < 0 || dotIndex < bracketIndex)) {
    propName = path.substring(0, dotIndex);
    restPath = path.substring(dotIndex);
  } else if (bracketIndex > 0) {
    propName = path.substring(0, bracketIndex);
    restPath = path.substring(bracketIndex);
  } else {
    propName = path;
    restPath = "";
  }

  // Recursively search for properties
  if (typeof obj === "object" && obj !== null) {
    // Check current level
    if (propName in obj) {
      const newPath = `${currentPath}.${propName}`;
      evaluatePath(obj[propName], restPath, newPath, results);
    }

    // Recurse into children
    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      let newPath: string;
      if (Array.isArray(obj)) {
        newPath = `${currentPath}[${key}]`;
      } else {
        newPath = `${currentPath}.${key}`;
      }

      // Recurse into this value
      if (typeof value === "object" && value !== null) {
        evaluateRecursiveDescent(value, path, newPath, results);
      }
    });
  }

  return results;
}

/**
 * Highlight a specific path in a JSON string
 * @param jsonString The formatted JSON string
 * @param path The JSONPath to highlight
 * @returns HTML string with highlighted path
 */
export function highlightJSONPath(
  jsonString: string,
  results: JSONPathResult[]
): string {
  if (!results.length) return jsonString;

  // Create a simple map of paths to highlight
  const highlightPaths = new Set(results.map((result) => result.path));

  // Build a syntax highlighted version of the JSON
  const lines = jsonString.split("\n");
  const outputLines: string[] = [];

  let currentPath = "$";
  let inString = false;
  let escapeNext = false;
  let inPropertyName = false;
  let currentPropertyName = "";
  let indentLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let outputLine = "";

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      // Handle string state
      if (char === '"' && !escapeNext) {
        inString = !inString;

        if (!inString && inPropertyName) {
          inPropertyName = false;

          // Update path when exiting property name
          if (
            currentPropertyName &&
            line
              .slice(j + 1)
              .trim()
              .startsWith(":")
          ) {
            currentPath = `${currentPath}.${currentPropertyName}`;
            currentPropertyName = "";
          }
        } else if (inString && !inPropertyName) {
          // Entering a string, check if it's a property name
          const rest = line.slice(j + 1);
          const propertyNameEnd = rest.indexOf('"');
          if (propertyNameEnd >= 0) {
            const afterQuote = rest.slice(propertyNameEnd + 1).trim();
            if (afterQuote.startsWith(":")) {
              inPropertyName = true;
              currentPropertyName = rest.slice(0, propertyNameEnd);
            }
          }
        }
      }

      // Handle escape character
      if (char === "\\" && inString) {
        escapeNext = !escapeNext;
      } else {
        escapeNext = false;
      }

      // Handle array and object start/end to update path
      if (!inString) {
        if (char === "{" || char === "[") {
          indentLevel++;
        } else if (char === "}" || char === "]") {
          indentLevel--;
          // Pop back up from the path
          const lastDot = currentPath.lastIndexOf(".");
          if (lastDot > 0) {
            currentPath = currentPath.substring(0, lastDot);
          }
        }
      }

      // Check if this character is in a highlighted path
      const isHighlighted = highlightPaths.has(currentPath);

      // Add the character to the output line with appropriate highlighting
      if (isHighlighted) {
        outputLine += `<span class="json-highlight">${char}</span>`;
      } else {
        outputLine += char;
      }
    }

    outputLines.push(outputLine);
  }

  return outputLines.join("\n");
}
