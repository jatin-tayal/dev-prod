import React from 'react';
import { UtilityPage } from '../../components/UtilityPage';
import { InputOutputPanel } from '../../components/InputOutputPanel';
import { InfoBox } from '../../components/Feedback';
import { useUtilityState } from '../../hooks';
import { validators } from '../../utils/ValidationError';

const JsonFormatter: React.FC = () => {
  const {
    input,
    output,
    isLoading,
    error,
    setInput,
    process,
    reset
  } = useUtilityState<string, string>({
    utilityId: 'json-formatter',
    utilityName: 'JSON Formatter',
    initialInput: '',
    processFunction: async (inputJson) => {
      // Parse the JSON to validate it
      const parsedJson = JSON.parse(inputJson);
      
      // Format with 2 spaces indentation
      return JSON.stringify(parsedJson, null, 2);
    },
    validateInput: validators.isValidJson('JSON'),
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
        The JSON Formatter helps you beautify and validate your JSON data. It formats messy JSON with proper indentation and spacing.
      </p>
      
      <h3 className="font-medium text-gray-900 dark:text-white">How to use:</h3>
      <ol className="list-decimal pl-5 space-y-2">
        <li>Paste your JSON in the input field</li>
        <li>Click "Format JSON" to process it</li>
        <li>Copy the formatted result from the output field</li>
      </ol>
      
      <h3 className="font-medium text-gray-900 dark:text-white">Example:</h3>
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
        <p className="text-sm font-mono whitespace-pre">{'{"name":"John","age":30,"city":"New York"}'}</p>
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
    </div>
  );

  return (
    <UtilityPage
      title="JSON Formatter"
      description="Format and validate your JSON data with proper indentation"
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
        outputValue={output || ''}
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