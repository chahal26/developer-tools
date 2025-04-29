"use client";

import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { githubLight } from '@uiw/codemirror-theme-github';

export default function JSONValidator() {
  const [jsonInput, setJsonInput] = useState('{\n  "name": "John",\n  "age": 30,\n  "city": "New York"\n}');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [minifiedJson, setMinifiedJson] = useState('');
  const [showTree, setShowTree] = useState(false);
  const [treeData, setTreeData] = useState([]);

  // Validate JSON and format it
  useEffect(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setIsValid(true);
      setError('');
      setFormattedJson(JSON.stringify(parsed, null, 2));
      setMinifiedJson(JSON.stringify(parsed));
      generateTreeData(parsed);
    } catch (err) {
      setIsValid(false);
      setError(err.message);
      setFormattedJson('');
      setMinifiedJson('');
      setTreeData([]);
    }
  }, [jsonInput]);

  const generateTreeData = (data, path = '') => {
    if (typeof data !== 'object' || data === null) {
      return [{
        path,
        type: typeof data,
        value: data?.toString() || String(data),
        length: null
      }];
    }

    const isArray = Array.isArray(data);
    const result = [];

    result.push({
      path,
      type: isArray ? 'array' : 'object',
      value: isArray ? `[${data.length} items]` : `{${Object.keys(data).length} keys}`,
      length: isArray ? data.length : Object.keys(data).length
    });

    Object.entries(data).forEach(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key;
      result.push(...generateTreeData(value, newPath));
    });

    return result;
  };

  const handleFormat = () => {
    if (isValid) {
      setJsonInput(formattedJson);
    }
  };

  const handleMinify = () => {
    if (isValid) {
      setJsonInput(minifiedJson);
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setIsValid(true);
    setError('');
  };

  const handleSample = () => {
    setJsonInput(`{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "New York"
  },
  "hobbies": ["reading", "traveling"],
  "projects": [
    {
      "name": "Project A",
      "status": "completed"
    },
    {
      "name": "Project B",
      "status": "in progress"
    }
  ]
}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">JSON Validator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input Panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-700">JSON Input</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleSample}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                Sample
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                Clear
              </button>
            </div>
          </div>
          
          <CodeMirror
            value={jsonInput}
            height="400px"
            extensions={[json()]}
            theme={githubLight}
            onChange={setJsonInput}
            className="border border-gray-300 rounded"
          />
          
          {!isValid && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-700">Result</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleFormat}
                disabled={!isValid}
                className={`px-3 py-1 text-sm rounded ${isValid ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-400'}`}
              >
                Format
              </button>
              <button
                onClick={handleMinify}
                disabled={!isValid}
                className={`px-3 py-1 text-sm rounded ${isValid ? 'bg-purple-100 hover:bg-purple-200 text-purple-800' : 'bg-gray-100 text-gray-400'}`}
              >
                Minify
              </button>
            </div>
          </div>
          
          {isValid ? (
            <CodeMirror
              value={formattedJson}
              height="400px"
              extensions={[json()]}
              theme={githubLight}
              readOnly={true}
              className="border border-gray-300 rounded"
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded border border-gray-200">
              <p className="text-gray-500">Invalid JSON - Please fix errors</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Tools */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">JSON Tools</h2>
          <button
            onClick={() => setShowTree(!showTree)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            {showTree ? 'Hide Structure' : 'Show Structure'}
          </button>
        </div>

        {showTree && isValid && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2 text-gray-700">JSON Structure</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {treeData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-mono text-gray-900">
                        {item.path || '<root>'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {item.type}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-mono max-w-xs truncate">
                        {item.value}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {item.length !== null ? item.length : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isValid && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-gray-50 rounded border border-gray-200">
              <h3 className="font-medium mb-2">Minified JSON</h3>
              <div className="p-2 bg-white rounded border border-gray-300 overflow-x-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap break-all">{minifiedJson}</pre>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(minifiedJson)}
                className="mt-2 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded"
              >
                Copy Minified
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded border border-gray-200">
              <h3 className="font-medium mb-2">Statistics</h3>
              <ul className="space-y-1 text-sm">
                <li>Characters: {jsonInput.length}</li>
                <li>Minified: {minifiedJson.length} chars ({Math.round((minifiedJson.length / jsonInput.length) * 100)}%)</li>
                <li>Depth: {Math.max(...treeData.map(item => item.path?.split('.').length || 0))}</li>
                <li>Total Nodes: {treeData.length}</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* JSON Guide */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">JSON Quick Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="font-medium mb-2">Basic Structure</h3>
            <pre className="text-sm bg-white p-2 rounded overflow-x-auto">{`{
  "key": "value",
  "number": 42,
  "boolean": true,
  "nullValue": null
}`}</pre>
          </div>
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="font-medium mb-2">Arrays</h3>
            <pre className="text-sm bg-white p-2 rounded overflow-x-auto">{`{
  "colors": ["red", "green", "blue"],
  "matrix": [[1, 2], [3, 4]]
}`}</pre>
          </div>
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="font-medium mb-2">Nested Objects</h3>
            <pre className="text-sm bg-white p-2 rounded overflow-x-auto">{`{
  "person": {
    "name": "Alice",
    "age": 30,
    "address": {
      "city": "Paris",
      "country": "France"
    }
  }
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}