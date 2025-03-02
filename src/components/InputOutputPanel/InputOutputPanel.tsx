import React, { useState } from "react";
import { Button } from "../UI";
import { useClipboard } from "../../hooks";

export type InputType = "text" | "json" | "file" | "code";

export interface InputOutputPanelProps {
  inputValue: string;
  outputValue: string;
  onInputChange: (value: string) => void;
  onClearInput?: () => void;
  onProcess?: () => void;
  onFileUpload?: (file: File) => void;
  inputType?: InputType;
  outputType?: InputType;
  inputLabel?: string;
  outputLabel?: string;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  processButtonText?: string;
  isLoading?: boolean;
  error?: string;
  inputHeight?: string;
  outputHeight?: string;
  className?: string;
  readOnly?: boolean;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string;
  allowFileDrop?: boolean;
}

const InputOutputPanel: React.FC<InputOutputPanelProps> = ({
  inputValue,
  outputValue,
  onInputChange,
  onClearInput,
  onProcess,
  onFileUpload,
  inputType = "text",
  outputType = "text",
  inputLabel = "Input",
  outputLabel = "Output",
  inputPlaceholder = "Enter your text here...",
  outputPlaceholder = "Output will appear here...",
  processButtonText = "Process",
  isLoading = false,
  error,
  inputHeight = "h-64",
  outputHeight = "h-64",
  className = "",
  readOnly = false,
  maxFileSize = 5, // 5MB default
  acceptedFileTypes = "",
  allowFileDrop = true,
}) => {
  const { copyToClipboard, copied } = useClipboard();
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
  };

  const handleClearInput = () => {
    if (onClearInput) {
      onClearInput();
    } else {
      onInputChange("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      if (maxFileSize && file.size > maxFileSize * 1024 * 1024) {
        alert(`File is too large. Max size: ${maxFileSize}MB`);
        return;
      }
      onFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!allowFileDrop || !onFileUpload) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (maxFileSize && file.size > maxFileSize * 1024 * 1024) {
        alert(`File is too large. Max size: ${maxFileSize}MB`);
        return;
      }
      onFileUpload(file);
    }
  };

  const copyOutput = () => {
    copyToClipboard(outputValue);
  };

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Input Section */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {inputLabel}
          </label>
          <div className="flex space-x-2">
            {onClearInput && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={handleClearInput}
                disabled={!inputValue || isLoading}
              >
                Clear
              </Button>
            )}
            {inputType === "file" && onFileUpload && (
              <div>
                <input
                  type="file"
                  id="file-upload"
                  className="sr-only"
                  onChange={handleFileUpload}
                  accept={acceptedFileTypes}
                  disabled={isLoading}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 cursor-pointer dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>

        <div
          className={`relative ${
            inputType === "file" && allowFileDrop ? "file-drop-area" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder={inputPlaceholder}
            disabled={isLoading || readOnly}
            className={`w-full ${inputHeight} px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              isDragging
                ? "border-primary-500 border-dashed"
                : "border-gray-300 dark:border-gray-700"
            } ${error ? "border-red-500" : ""}`}
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          {inputType === "file" && allowFileDrop && isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-md z-10">
              <div className="text-white font-medium">Drop file here</div>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
        )}
      </div>

      {/* Action Buttons */}
      {onProcess && (
        <div className="flex justify-center">
          <Button
            onClick={onProcess}
            disabled={!inputValue || isLoading}
            isLoading={isLoading}
            className="px-6"
          >
            {processButtonText}
          </Button>
        </div>
      )}

      {/* Output Section */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {outputLabel}
          </label>
          <div className="flex space-x-2">
            {outputValue && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={copyOutput}
                disabled={isLoading}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
        </div>
        <div className="relative">
          <textarea
            value={outputValue}
            readOnly
            placeholder={outputPlaceholder}
            className={`w-full ${outputHeight} px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-300 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
            spellCheck="false"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-20 dark:bg-opacity-40 rounded-md">
              <div className="flex flex-col items-center">
                <svg
                  className="animate-spin h-8 w-8 text-primary-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Processing...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputOutputPanel;
