import React from "react";
import { UtilityPage } from "../../components/UtilityPage";
import { InputOutputPanel } from "../../components/InputOutputPanel";
import { InfoBox } from "../../components/Feedback";
import { useUtilityState } from "../../hooks";
import { validators } from "../../utils/ValidationError";

const JsonValidator: React.FC = () => {
  const { input, output, isLoading, error, setInput, process, reset } =
    useUtilityState<string, string>({
      utilityId: "json-validator",
      utilityName: "JSON Validator",
      initialInput: "",
      processFunction: async (inputJson) => {
        // Parse the JSON to validate it and then pretty print it
        const parsedJson = JSON.parse(inputJson);
        return JSON.stringify(parsedJson, null, 2);
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
        The JSON Validator helps you check if your JSON is valid and properly
        formatted. It will show you any syntax errors in your JSON.
      </p>

      <h3 className="font-medium text-gray-900 dark:text-white">How to use:</h3>
      <ol className="list-decimal pl-5 space-y-2">
        <li>Paste your JSON in the input field</li>
        <li>Click "Validate JSON" to check if it's valid</li>
        <li>If valid, you'll see nicely formatted JSON in the output</li>
        <li>If invalid, you'll see an error message explaining the issue</li>
      </ol>

      <h3 className="font-medium text-gray-900 dark:text-white">
        Common JSON errors:
      </h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Missing or extra commas</li>
        <li>Missing quotes around property names</li>
        <li>Unmatched brackets or braces</li>
        <li>Using single quotes instead of double quotes</li>
        <li>Trailing commas at the end of objects or arrays</li>
      </ul>
    </div>
  );

  return (
    <UtilityPage
      title="JSON Validator"
      description="Validate and format your JSON with helpful error messages"
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
        processButtonText="Validate JSON"
        inputPlaceholder='Enter JSON here. For example: {"name":"John","age":30}'
        outputPlaceholder="Valid JSON will appear here..."
      />
    </UtilityPage>
  );
};

export default JsonValidator;
