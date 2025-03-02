import React, { useState } from "react";
import { UtilityPage } from "../../components/UtilityPage";
import { InputOutputPanel } from "../../components/InputOutputPanel";
import { Select } from "../../components/UI";
import { useUtilityState } from "../../hooks";
import { validators } from "../../utils/ValidationError";
import { formatJsonAsString, StringFormatType } from "../../utils/stringUtils";

const JsonToString: React.FC = () => {
  const [formatType, setFormatType] = useState<StringFormatType>("javascript");

  const { input, output, isLoading, error, setInput, process, reset } =
    useUtilityState<string, string>({
      utilityId: "json-to-string",
      utilityName: "JSON to String Converter",
      initialInput: "",
      processFunction: async (inputJson) => {
        return formatJsonAsString(inputJson, formatType);
      },
      validateInput: validators.isValidJson("JSON"),
      persist: true,
      persistInput: true,
      persistOutput: false,
      syncWithUrl: true,
      autoProcess: false,
    });

  const formatOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "python", label: "Python" },
    { value: "go", label: "Go" },
    { value: "double-quotes", label: "String with double quotes" },
    { value: "single-quotes", label: "String with single quotes" },
  ];

  const handleFormatChange = (value: string) => {
    setFormatType(value as StringFormatType);
  };

  // Help content for the utility
  const helpContent = (
    <div className="space-y-4">
      <p>
        The JSON to String Converter helps you convert JSON data to string
        representations in various programming languages and formats.
      </p>

      <h3 className="font-medium text-gray-900 dark:text-white">How to use:</h3>
      <ol className="list-decimal pl-5 space-y-2">
        <li>Paste your JSON in the input field</li>
        <li>Select the desired output format</li>
        <li>Click "Convert JSON to String" to process</li>
        <li>Copy the escaped string from the output field</li>
      </ol>

      <h3 className="font-medium text-gray-900 dark:text-white">
        Available formats:
      </h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>JavaScript:</strong> Formats as a JavaScript object
          declaration
        </li>
        <li>
          <strong>Java:</strong> Creates a Java string with proper escaping
        </li>
        <li>
          <strong>C#:</strong> Creates a C# string with proper escaping
        </li>
        <li>
          <strong>Python:</strong> Creates a Python multi-line string
        </li>
        <li>
          <strong>Go:</strong> Creates a Go raw string literal
        </li>
        <li>
          <strong>String with double quotes:</strong> Just the JSON string with
          double quotes
        </li>
        <li>
          <strong>String with single quotes:</strong> JSON string with single
          quotes (for languages that support it)
        </li>
      </ul>

      <h3 className="font-medium text-gray-900 dark:text-white">Example:</h3>
      <p>
        For the input <code className="font-mono">{"{'name':'John'}"}</code>{" "}
        with JavaScript format, the output will be:
      </p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm font-mono">
        {`const jsonObject = {"name":"John"};`}
      </pre>
    </div>
  );

  return (
    <UtilityPage
      title="JSON to String Converter"
      description="Convert JSON to properly escaped strings for various programming languages"
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
        <Select
          label="Output Format"
          value={formatType}
          onChange={handleFormatChange}
          options={formatOptions}
        />
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
        outputType="text"
        processButtonText="Convert JSON to String"
        inputPlaceholder='Enter JSON here. For example: {"name":"John","age":30}'
        outputPlaceholder="Escaped string will appear here..."
      />
    </UtilityPage>
  );
};

export default JsonToString;
