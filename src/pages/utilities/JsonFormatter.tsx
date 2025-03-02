import React, { useState } from "react";
import { UtilityPage } from "../../components/UtilityPage";
import { InputOutputPanel } from "../../components/InputOutputPanel";
import { Button, RadioButton, Checkbox } from "../../components/UI";
import { useUtilityState } from "../../hooks";
import { validators } from "../../utils/ValidationError";
import { countStats } from "../../utils/stringUtils";

interface FormatOptions {
  indentation: "2" | "4" | "8";
  sortKeys: boolean;
}

const JsonFormatter: React.FC = () => {
  const [options, setOptions] = useState<FormatOptions>({
    indentation: "2",
    sortKeys: false,
  });

  const { input, output, isLoading, error, setInput, process, reset } =
    useUtilityState<string, string>({
      utilityId: "json-formatter",
      utilityName: "JSON Formatter",
      initialInput: "",
      processFunction: async (inputJson) => {
        // Parse the JSON
        const parsedJson = JSON.parse(inputJson);

        // Determine indentation
        const spaces = parseInt(options.indentation, 10);

        // Format with specified indentation and optional key sorting
        if (options.sortKeys) {
          // Recursively sort keys for all objects
          const sortedJson = sortJsonKeys(parsedJson);
          return JSON.stringify(sortedJson, null, spaces);
        } else {
          return JSON.stringify(parsedJson, null, spaces);
        }
      },
      validateInput: validators.isValidJson("JSON"),
      persist: true,
      persistInput: true,
      persistOutput: false,
      syncWithUrl: true,
      autoProcess: false,
    });

  // Function to recursively sort keys in an object
  const sortJsonKeys = (obj: any): any => {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(sortJsonKeys);
    }

    return Object.keys(obj)
      .sort()
      .reduce((result: Record<string, any>, key) => {
        result[key] = sortJsonKeys(obj[key]);
        return result;
      }, {});
  };

  // Calculate character counts
  const inputStats = countStats(input);
  const outputStats = countStats(output || "");

  // Help content for the utility
  const helpContent = (
    <div className="space-y-4">
      <p>
        The JSON Formatter helps you beautify and validate your JSON data. It
        formats messy JSON with proper indentation and spacing.
      </p>

      <h3 className="font-medium text-gray-900 dark:text-white">How to use:</h3>
      <ol className="list-decimal pl-5 space-y-2">
        <li>Paste your JSON in the input field</li>
        <li>Choose your preferred indentation (2, 4, or 8 spaces)</li>
        <li>Optionally enable sorting of object keys alphabetically</li>
        <li>Click "Format JSON" to process it</li>
        <li>Copy the formatted result from the output field</li>
      </ol>

      <h3 className="font-medium text-gray-900 dark:text-white">Example:</h3>
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
        <p className="text-sm font-mono whitespace-pre">
          {'{"name":"John","age":30,"city":"New York"}'}
        </p>
      </div>
      <p>Will be formatted as:</p>
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
        <pre className="text-sm font-mono whitespace-pre">
          {`{
  "name": "John",
  "age": 30,
  "city": "New York"
}`}
        </pre>
      </div>

      <h3 className="font-medium text-gray-900 dark:text-white">Options:</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Indentation:</strong> Choose the number of spaces for each
          level of indentation
        </li>
        <li>
          <strong>Sort Keys:</strong> Alphabetically sort the keys in all
          objects
        </li>
      </ul>
    </div>
  );

  return (
    <UtilityPage
      title="JSON Formatter"
      description="Format and beautify your JSON data with customizable indentation"
      helpContent={helpContent}
      actions={
        <button
          onClick={() => reset()}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Reset
        </button>
      }
    >
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <RadioButton
              name="indentation"
              label="Indentation"
              options={[
                { value: "2", label: "2 spaces" },
                { value: "4", label: "4 spaces" },
                { value: "8", label: "8 spaces" },
              ]}
              value={options.indentation}
              onChange={(value) =>
                setOptions({
                  ...options,
                  indentation: value as "2" | "4" | "8",
                })
              }
              orientation="horizontal"
            />
          </div>
          <div className="flex-1">
            <Checkbox
              checked={options.sortKeys}
              onChange={(checked) =>
                setOptions({ ...options, sortKeys: checked })
              }
              label="Sort keys alphabetically"
            />
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-between text-sm">
        <div className="text-gray-600 dark:text-gray-400">
          Input: {inputStats.chars} characters ({inputStats.nonWhitespaceChars}{" "}
          non-whitespace)
        </div>
        {output && (
          <div className="text-gray-600 dark:text-gray-400">
            Output: {outputStats.chars} characters (
            {outputStats.nonWhitespaceChars} non-whitespace)
          </div>
        )}
      </div>

      <InputOutputPanel
        inputValue={input}
        outputValue={output || ""}
        onInputChange={setInput}
        onProcess={process}
        onClearInput={reset}
        isLoading={isLoading}
        error={error?.message}
        inputType="json"
        outputType="json"
        processButtonText="Format JSON"
        inputPlaceholder='Enter JSON here. For example: {"name":"John","age":30}'
        outputPlaceholder="Formatted JSON will appear here..."
      />
    </UtilityPage>
  );
};

export default JsonFormatter;
