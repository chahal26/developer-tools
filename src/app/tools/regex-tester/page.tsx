"use client";

import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function RegexTester() {
  const [regex, setRegex] = useState('/[A-Z]\\w+/g');
  const [testString, setTestString] = useState('The Quick Brown Fox Jumps Over The Lazy Dog');
  const [matches, setMatches] = useState([]);
  const [flags, setFlags] = useState('g');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');

  // Process regex matching
  useEffect(() => {
    try {
      // Clean the regex input (remove slashes and flags if typed)
      let pattern = regex;
      let actualFlags = flags;
      
      // Extract pattern and flags if input looks like /pattern/flags
      const regexParts = regex.match(/^\/(.*?)\/([gimuy]*)$/);
      if (regexParts) {
        pattern = regexParts[1];
        actualFlags = regexParts[2] || flags;
      }

      const regexObj = new RegExp(pattern, actualFlags);
      setIsValid(true);
      setError('');

      // Find all matches
      const matchArray = [];
      let match;
      while ((match = regexObj.exec(testString)) !== null) {
        matchArray.push({
          text: match[0],
          index: match.index,
          groups: match.groups || null
        });
        
        // Prevent infinite loops for zero-width matches
        if (match.index === regexObj.lastIndex) {
          regexObj.lastIndex++;
        }
      }

      setMatches(matchArray);
    } catch (err) {
      setIsValid(false);
      setError(err.message);
      setMatches([]);
    }
  }, [regex, testString, flags]);

  // Highlight matches in the test string
  const renderHighlightedText = () => {
    if (!isValid) return testString;

    let result = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        result.push(testString.substring(lastIndex, match.index));
      }

      // Add highlighted match
      result.push(
        <span key={i} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {match.text}
        </span>
      );

      lastIndex = match.index + match.text.length;
    });

    // Add remaining text
    if (lastIndex < testString.length) {
      result.push(testString.substring(lastIndex));
    }

    return result.length > 0 ? result : testString;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Regex Tester</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Regex Input */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Regular Expression</h2>
          <div className="flex items-center mb-2">
            <span className="text-gray-500 mr-2">/</span>
            <CodeMirror
              value={regex.replace(/^\/|\/[gimuy]*$/g, '')}
              height="100px"
              extensions={[javascript()]}
              onChange={(value) => setRegex(`/${value}/${flags}`)}
              className="flex-grow border border-gray-300 rounded"
            />
            <span className="text-gray-500 mx-2">/</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value.replace(/[^gimuy]/g, ''))}
              className="w-16 p-2 border border-gray-300 rounded"
              placeholder="flags"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => setRegex('/\\w+/g')}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Word
            </button>
            <button
              onClick={() => setRegex('/\\d+/g')}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Number
            </button>
            <button
              onClick={() => setRegex('/[A-Z]\\w+/g')}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Capitalized
            </button>
            <button
              onClick={() => setRegex('/^[\\w.%+-]+@[\\w.-]+\\.[a-z]{2,}$/i')}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Email
            </button>
          </div>
        </div>

        {/* Test String Input */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Test String</h2>
          <CodeMirror
            value={testString}
            height="150px"
            extensions={[javascript()]}
            onChange={setTestString}
            className="border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Results Panel */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Results</h2>
        
        {!isValid && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
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

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-700">Matched Text</h3>
          <div className="p-4 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap font-mono">
            {renderHighlightedText()}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-700">Match Details</h3>
          {matches.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {matches.map((match, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-mono">{match.text}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{match.index}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{match.text.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {isValid ? 'No matches found' : 'Invalid regular expression'}
            </div>
          )}
        </div>
      </div>

      {/* Cheat Sheet */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Regex Cheat Sheet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="font-medium mb-2">Character Classes</h3>
            <ul className="text-sm space-y-1">
              <li><code className="bg-gray-100 px-1 rounded">.</code> Any character</li>
              <li><code className="bg-gray-100 px-1 rounded">\d</code> Digit (0-9)</li>
              <li><code className="bg-gray-100 px-1 rounded">\w</code> Word character (a-z, A-Z, 0-9, _)</li>
              <li><code className="bg-gray-100 px-1 rounded">\s</code> Whitespace</li>
              <li><code className="bg-gray-100 px-1 rounded">[abc]</code> Any of a, b, or c</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="font-medium mb-2">Quantifiers</h3>
            <ul className="text-sm space-y-1">
              <li><code className="bg-gray-100 px-1 rounded">*</code> 0 or more</li>
              <li><code className="bg-gray-100 px-1 rounded">+</code> 1 or more</li>
              <li><code className="bg-gray-100 px-1 rounded">?</code> 0 or 1</li>
              <li><code className="bg-gray-100 px-1 rounded">{'{3}'}</code> Exactly 3</li>
              <li><code className="bg-gray-100 px-1 rounded">{'{3,5}'}</code> 3 to 5</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="font-medium mb-2">Anchors</h3>
            <ul className="text-sm space-y-1">
              <li><code className="bg-gray-100 px-1 rounded">^</code> Start of string</li>
              <li><code className="bg-gray-100 px-1 rounded">$</code> End of string</li>
              <li><code className="bg-gray-100 px-1 rounded">\b</code> Word boundary</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}