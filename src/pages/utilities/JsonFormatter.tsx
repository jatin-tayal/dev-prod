import React, { useState, useCallback } from 'react';
import { UtilityPage } from '../../components/UtilityPage';
import { InputOutputPanel } from '../../components/InputOutputPanel';
import { InfoBox } from '../../components/Feedback';
import { useLocalStorage } from '../../hooks';

const JsonFormatter: React.FC = () => {
  // Persistent state with localStorage
  const [input, setInput] = useLocalStorage('json-formatter-input', '');
  const [output, setOutput] = useLocalStorage('json-formatter-output', '');
  
  // UI state
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const formatJSON = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter JSON to format');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate processing delay
    setTimeout(() => {
      try {
        // Parse the JSON to validate it
        const parsedJson = JSON.parse(input);
        
        // Format with 2 spaces indentation
        const formattedJson = JSON.stringify(parsedJson, null, 2);
        
        setOutput(formattedJson);
        setError('');
      } catch (err) {
        setError(`Invalid JSON: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setOutput('');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [input, setOutput]);

  const clearInput = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
  }, [setInput, setOutput]);

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
    >
      <InputOutputPanel
        inputValue={input}
        outputValue={output}
        onInputChange={setInput}
        onProcess={formatJSON}
        onClearInput={clearInput}
        isLoading={isLoading}
        error={error}
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
