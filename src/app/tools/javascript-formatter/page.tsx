"use client";

import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function JavascriptFormatter() {
  const [code, setCode] = useState("// Paste your code here\nfunction hello() {\n  console.log('Hello');\n}");
  const [formattedCode, setFormattedCode] = useState("");

  const formatCode = async () => {
    try {
      // Import Prettier and required plugins
      const prettier = await import('prettier/standalone');
      const babelParser = await import('prettier/parser-babel');
      const estreePlugin = await import('prettier/plugins/estree');
  
      // Format the code with proper plugin references
      const formatted = await prettier.format(code, {
        parser: 'babel',
        plugins: [
          babelParser, // The Babel parser plugin
          estreePlugin.default, // The ESTree plugin (need to use .default)
        ],
        semi: false,
        singleQuote: true,
      });
      
      setFormattedCode(formatted);
    } catch (error) {
      console.error('Formatting error:', error);
      setFormattedCode('Error formatting code: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">JavaScript Code Formatter</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl mb-2">Input</h2>
          <CodeMirror
            value={code}
            height="300px"
            extensions={[javascript()]}
            onChange={(value) => setCode(value)}
          />
          <button 
            onClick={formatCode}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Format Code
          </button>
        </div>

        <div>
          <h2 className="text-xl mb-2">Formatted Output</h2>
          <CodeMirror
            value={formattedCode}
            height="300px"
            extensions={[javascript()]}
            editable={false}
          />
          <button 
            onClick={() => navigator.clipboard.writeText(formattedCode)}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Copy Code
          </button>
        </div>
      </div>

      {/* AdSense Placeholder (Replace with your unit) */}
      <div className="mt-8 p-4 bg-gray-100 text-center">
        <p>Ad Space (Google AdSense)</p>
      </div>
    </div>
  );
}