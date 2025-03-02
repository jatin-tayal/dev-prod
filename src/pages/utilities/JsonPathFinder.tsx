import React, { useState } from "react";
import { UtilityPage } from "../../components/UtilityPage";
import { InputOutputPanel } from "../../components/InputOutputPanel";
import { InfoBox } from "../../components/Feedback";
import { useUtilityState } from "../../hooks";
import { validators } from "../../utils/ValidationError";
import { evaluateJSONPath } from "../../utils/jsonPathUtils";
import { Button } from "../../components/UI";

const JsonPathFinder: React.FC = () => {
  const [jsonPath, setJsonPath] = useState<string>("$");
  const [matchResults, setMatchResults] = useState<any[]>([]);

  const {
    input,
    output,
    isLoading,
    error,
    setInput,
    setOutput,
    process,
    reset,
  } = useUtilityState<string, string>({
    utilityId: "json-path-finder",
    utilityName: "JSON Path Finder",
    initialInput: "",
    processFunction: async (inputJson) => {
      // Parse the JSON
      const parsedJson = JSON.parse(inputJson);

      // Evaluate the JSONPath expression
      const results = evaluateJSONPath(parsedJson, jsonPath);

      // Store the results for display
      setMatchResults(results.map((result) => result.value));

      // Format the JSON with highlighting
      let formattedJson = JSON.stringify(parsedJson, null, 2);

      // Generate output with match information
      const match_output =
        results.length === 0
          ? "No matches found for this JSONPath expression."
          : `Found ${results.length} match${
              results.length === 1 ? "" : "es"
            }\n\n` +
            results
              .map(
                (result, index) =>
                  `Match ${index + 1} (Path: ${result.path}):\n` +
                  JSON.stringify(result.value, null, 2)
              )
              .join("\n\n");

      return match_output;
    },
    validateInput: validators.isValidJson("JSON"),
    persist: true,
    persistInput: true,
    persistOutput: false,
    syncWithUrl: true,
    autoProcess: false,
  });

  // Help content for the utility
  const helpContent = (
    <div className="space-y-4">
      <p>
        The JSON Path Finder helps you extract specific data from JSON using
        JSONPath expressions.
      </p>

      <h3 className="font-medium text-gray-900 dark:text-white">
        JSONPath Syntax:
      </h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2 text-left">Symbol</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Example</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t dark:border-gray-700">
            <td className="p-2 font-mono">$</td>
            <td className="p-2">Root object/element</td>
            <td className="p-2 font-mono">$</td>
          </tr>
          <tr className="border-t dark:border-gray-700">
            <td className="p-2 font-mono">.</td>
            <td className="p-2">Child element</td>
            <td className="p-2 font-mono">$.store.book</td>
          </tr>
          <tr className="border-t dark:border-gray-700">
            <td className="p-2 font-mono">..</td>
            <td className="p-2">Recursive descent (search all)</td>
            <td className="p-2 font-mono">$..price</td>
          </tr>
          <tr className="border-t dark:border-gray-700">
            <td className="p-2 font-mono">*</td>
            <td className="p-2">Wildcard (all elements)</td>
            <td className="p-2 font-mono">$.store.book[*]</td>
          </tr>
          <tr className="border-t dark:border-gray-700">
            <td className="p-2 font-mono">[n]</td>
            <td className="p-2">Array index</td>
            <td className="p-2 font-mono">$.store.book[0]</td>
          </tr>
          <tr className="border-t dark:border-gray-700">
            <td className="p-2 font-mono">[start:end]</td>
            <td className="p-2">Array slice</td>
            <td className="p-2 font-mono">$.store.book[0:2]</td>
          </tr>
          <tr className="border-t dark:border-gray-700">
            <td className="p-2 font-mono">[?(expr)]</td>
            <td className="p-2">Filter expression</td>
            <td className="p-2 font-mono">$.store.book[?(@.price&lt;10)]</td>
          </tr>
        </tbody>
      </table>

      <h3 className="font-medium text-gray-900 dark:text-white">Examples:</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <code className="font-mono">$.store.book[0].title</code> - First book
          title
        </li>
        <li>
          <code className="font-mono">$..author</code> - All authors
        </li>
        <li>
          <code className="font-mono">$.store.book[*].author</code> - All book
          authors
        </li>
        <li>
          <code className="font-mono">$.store.book[?(@.price&lt;10)]</code> -
          Books less than $10
        </li>
        <li>
          <code className="font-mono">
            $.store.book[?(@.category=='fiction')]
          </code>{" "}
          - Fiction books
        </li>
      </ul>
    </div>
  );

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJsonPath(e.target.value);
  };

  return (
    <UtilityPage
      title="JSON Path Finder"
      description="Extract data from JSON using JSONPath expressions"
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
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          JSONPath Expression
        </label>
        <div className="flex">
          <input
            type="text"
            value={jsonPath}
            onChange={handlePathChange}
            placeholder="Enter JSONPath expression (e.g., $.store.book[0].title)"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
          />
          <Button
            onClick={() => process()}
            isLoading={isLoading}
            disabled={isLoading || !input.trim()}
            className="ml-2"
          >
            Evaluate
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          JSON Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter JSON here. For example: {"store":{"book":[{"title":"Example Book","price":10}]}}'
          className="w-full h-64 px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          spellCheck="false"
        />
      </div>

      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400 text-sm">
          {error.message}
        </div>
      )}

      {output && !error && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Results
          </h3>
          <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto text-sm font-mono text-gray-800 dark:text-gray-200">
            {output}
          </pre>
        </div>
      )}

      <div className="mt-6">
        <InfoBox title="Example JSON">
          <p className="mb-2">
            You can use this sample JSON to test JSONPath expressions:
          </p>
          <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md overflow-auto text-xs font-mono">
            {`{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      {
        "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}`}
          </pre>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Try example path:{" "}
            <code className="font-mono">$..book[?(@.price&lt;10)]</code> to find
            all books under $10.
          </p>
        </InfoBox>
      </div>
    </UtilityPage>
  );
};

export default JsonPathFinder;
