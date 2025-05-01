"use client";

import { useState, useEffect } from 'react';
import { ClipboardDocumentIcon, ArrowPathIcon, DocumentArrowUpIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function Base64Tool() {
  const [inputText, setInputText] = useState('Sample text to encode/decode');
  const [outputText, setOutputText] = useState('');
  const [operation, setOperation] = useState('encode');
  const [isValid, setIsValid] = useState(true);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle text conversion
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    try {
      setIsProcessing(true);
      if (operation === 'encode') {
        setOutputText(btoa(encodeURIComponent(inputText).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)))));
      } else {
        setOutputText(decodeURIComponent(Array.prototype.map.call(atob(inputText), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
      }
      setIsValid(true);
    } catch {
      setIsValid(false);
      setOutputText('Invalid Base64 string for decoding');
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, operation]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
    
      if (result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(result);
        let binary = '';
        bytes.forEach((byte) => {
          binary += String.fromCharCode(byte);
        });
        setInputText(btoa(binary));
        setOperation('encode');
      } else {
        console.error('Expected ArrayBuffer but got:', typeof result);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownload = () => {
    if (!outputText || operation !== 'decode') return;

    try {
      const binaryString = atob(outputText);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: fileType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'decoded_file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOperation(operation === 'encode' ? 'decode' : 'encode');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setFileName('');
    setFileSize(0);
    setFileType('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Base64 Encoder/Decoder</h1>
      
      {/* Operation Selector */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-blue-600"
              checked={operation === 'encode'}
              onChange={() => setOperation('encode')}
            />
            <span className="ml-2 text-gray-700">Encode</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-blue-600"
              checked={operation === 'decode'}
              onChange={() => setOperation('decode')}
            />
            <span className="ml-2 text-gray-700">Decode</span>
          </label>
        </div>

        <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow">
          <button
            onClick={handleSwap}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
            title="Swap"
          >
            <ArrowPathIcon className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={handleClear}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
            title="Clear"
          >
            <span className="text-gray-700">Clear All</span>
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {operation === 'encode' ? 'Upload File to Encode' : 'Decode and Download File'}
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex-1">
            <div className="flex items-center justify-center px-6 py-8 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors">
              <div className="text-center">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">
                  {operation === 'encode' ? 'Click to upload file' : 'Decode Base64 to file'}
                </p>
                {fileName && (
                  <p className="mt-1 text-xs text-gray-500">
                    {fileName} ({Math.round(fileSize / 1024)} KB)
                  </p>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </label>
          {operation === 'decode' && outputText && (
            <button
              onClick={handleDownload}
              disabled={!outputText || operation !== 'decode'}
              className="flex items-center justify-center px-4 py-8 border-2 border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-500 transition-colors disabled:opacity-50"
            >
              <DocumentArrowDownIcon className="h-12 w-12 text-blue-500" />
            </button>
          )}
        </div>
      </div>

      {/* Input/Output Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input Panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-700">
              {operation === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
            </h2>
            <button
              onClick={() => handleCopy(inputText)}
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Copy to clipboard"
            >
              <ClipboardDocumentIcon className="h-5 w-5" />
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder={operation === 'encode' ? 'Enter text to encode...' : 'Paste Base64 to decode...'}
          />
        </div>

        {/* Output Panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-700">
              {operation === 'encode' ? 'Base64 Result' : 'Decoded Text'}
            </h2>
            <div className="flex space-x-1">
              <button
                onClick={() => handleCopy(outputText)}
                className="p-1 text-gray-500 hover:text-gray-700"
                title="Copy to clipboard"
              >
                <ClipboardDocumentIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          {isProcessing ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <textarea
              readOnly
              value={outputText}
              className={`w-full h-64 p-3 border rounded font-mono text-sm ${
                !isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder={operation === 'encode' ? 'Base64 will appear here...' : 'Decoded text will appear here...'}
            />
          )}
          {!isValid && (
            <p className="mt-2 text-sm text-red-600">Invalid Base64 input for decoding</p>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">About Base64</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2 text-gray-800">What is Base64?</h3>
            <p className="text-gray-600">
              Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.
              It is commonly used to encode data that needs to be stored and transferred over media designed to deal with text.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-gray-800">Common Uses</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Embedding images in HTML/CSS</li>
              <li>Sending binary data over text-based protocols</li>
              <li>Storing complex data in JSON</li>
              <li>Basic obfuscation of data</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2 text-gray-800">Example</h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
            <pre className="text-sm font-mono">
              {`// Original string
"Hello World!"

// Base64 encoded
"SGVsbG8gV29ybGQh"

// URL-safe variant (replace +/ with -_)
"SGVsbG8gV29ybGQh"`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}