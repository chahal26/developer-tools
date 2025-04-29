'use client';

import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { githubLight } from '@uiw/codemirror-theme-github';
import { format } from 'sql-formatter';


export default function SQLFormatter() {
  const [sqlInput, setSqlInput] = useState('SELECT * FROM users WHERE age > 25 AND city = "New York";');
  const [formattedSQL, setFormattedSQL] = useState('');
  const [minifiedSQL, setMinifiedSQL] = useState('');
  const [error, setError] = useState('');

  const minifySQL = (sql: string): string => {
    return sql
      .replace(/\s+/g, ' ')   // Collapse all whitespace into a single space
      .trim();                // Trim leading/trailing whitespace
  };

  
  useEffect(() => {
    try {
      const formatted = format(sqlInput);
      const minified = minifySQL(sqlInput);
      setFormattedSQL(formatted);
      setMinifiedSQL(minified);
      setError('');
    } catch (err) {
      setFormattedSQL('');
      setMinifiedSQL('');
      setError(err.message || 'Invalid SQL');
    }
  }, [sqlInput]);

  const handleFormat = () => {
    if (formattedSQL) setSqlInput(formattedSQL);
  };

  const handleMinify = () => {
    if (minifiedSQL) setSqlInput(minifiedSQL);
  };

  const handleClear = () => {
    setSqlInput('');
    setError('');
  };

  const handleSample = () => {
    setSqlInput(`SELECT u.name, COUNT(o.id) AS order_count
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
GROUP BY u.name
ORDER BY order_count DESC;`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">SQL Formatter</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input Panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-700">SQL Input</h2>
            <div className="flex space-x-2">
              <button onClick={handleSample} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">Sample</button>
              <button onClick={handleClear} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">Clear</button>
            </div>
          </div>

          <CodeMirror
            value={sqlInput}
            height="400px"
            extensions={[sql()]}
            theme={githubLight}
            onChange={setSqlInput}
            className="border border-gray-300 rounded"
          />

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
              Error: {error}
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-700">Formatted Output</h2>
            <div className="flex space-x-2">
              <button onClick={handleFormat} className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded">Format</button>
              <button onClick={handleMinify} className="px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 rounded">Minify</button>
            </div>
          </div>

          {formattedSQL ? (
            <CodeMirror
              value={formattedSQL}
              height="400px"
              extensions={[sql()]}
              theme={githubLight}
              readOnly={true}
              className="border border-gray-300 rounded"
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded border border-gray-200">
              <p className="text-gray-500">Invalid SQL - Please fix errors</p>
            </div>
          )}
        </div>
      </div>

      {formattedSQL && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded border border-gray-200">
              <h3 className="font-medium mb-2">Minified SQL</h3>
              <div className="p-2 bg-white rounded border border-gray-300 overflow-x-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap break-all">{minifiedSQL}</pre>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(minifiedSQL)}
                className="mt-2 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded"
              >
                Copy Minified
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded border border-gray-200">
              <h3 className="font-medium mb-2">Statistics</h3>
              <ul className="space-y-1 text-sm">
                <li>Characters: {sqlInput.length}</li>
                <li>Minified: {minifiedSQL.length} chars</li>
                <li>Lines: {formattedSQL.split('\n').length}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
