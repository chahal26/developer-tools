'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';
import { markdown as markdownLang } from '@codemirror/lang-markdown';

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(`# Markdown Preview

## Features

- Live preview
- GitHub Flavored Markdown (tables, strikethrough, task lists)
- Syntax highlighting for code blocks

\`\`\`js
console.log("Hello, Markdown!");
\`\`\`

- **Bold**, *Italic*, ~~Strikethrough~~

| Table | Example |
|-------|---------|
| Cell 1 | Cell 2 |
`);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Markdown Preview</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Markdown Input</h2>
          <CodeMirror
            value={markdown}
            height="400px"
            extensions={[markdownLang()]}
            theme={githubLight}
            onChange={setMarkdown}
            className="border border-gray-300 rounded"
          />
        </div>

        {/* Preview */}
        <div className="bg-white p-4 rounded-lg shadow overflow-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Live Preview</h2>
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
