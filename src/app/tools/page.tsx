"use client";

import { useState } from 'react';
import Link from 'next/link';

const tools = [
  {
    id: 1,
    name: 'JavaScript Formatter',
    description: 'Format and beautify your JavaScript code with Prettier',
    category: 'code',
    icon: '💻',
    url: '/tools/javascript-formatter',
    featured: true
  },
  {
    id: 2,
    name: 'JSON Validator',
    description: 'Validate and format JSON data with syntax highlighting',
    category: 'data',
    icon: '📝',
    url: '/tools/json-validator'
  },
  {
    id: 3,
    name: 'Regex Tester',
    description: 'Test regular expressions against sample text with real-time matching',
    category: 'text',
    icon: '🔍',
    url: '/tools/regex-tester',
    featured: true
  },
  {
    id: 4,
    name: 'Base64 Encoder/Decoder',
    description: 'Convert strings to/from Base64 encoding',
    category: 'encoding',
    icon: '🔢',
    url: '/tools/base64'
  },
  {
    id: 5,
    name: 'SQL Formatter',
    description: 'Format SQL queries for better readability',
    category: 'code',
    icon: '🗃️',
    url: '/tools/sql-formatter'
  },
  {
    id: 6,
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL color formats',
    category: 'design',
    icon: '🎨',
    url: '/tools/color-converter'
  },
  {
    id: 7,
    name: 'Markdown Preview',
    description: 'Preview rendered Markdown in real-time',
    category: 'text',
    icon: '📄',
    url: '/tools/markdown-preview'
  },
  {
    id: 8,
    name: 'API Tester',
    description: 'Make HTTP requests and inspect responses',
    category: 'web',
    icon: '🌐',
    url: '/tools/api-tester',
    featured: true
  }
];

const categories = [
  { id: 'all', name: 'All Tools' },
  { id: 'code', name: 'Code' },
  { id: 'data', name: 'Data' },
  { id: 'text', name: 'Text' },
  { id: 'web', name: 'Web' },
  { id: 'design', name: 'Design' },
  { id: 'encoding', name: 'Encoding' }
];

export default function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Developer Tools</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Boost your productivity with our collection of free online developer tools
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Tools */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools
              .filter(tool => tool.featured)
              .map(tool => (
                <Link
                  key={tool.id}
                  href={tool.url}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{tool.icon}</span>
                      <h3 className="text-xl font-semibold text-gray-800">{tool.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    <div className="text-blue-600 font-medium">Try it now →</div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* All Tools */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {selectedCategory === 'all' ? 'All Tools' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          
          {filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No tools found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <Link
                  key={tool.id}
                  href={tool.url}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{tool.icon}</span>
                      <h3 className="text-lg font-semibold text-gray-800">{tool.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <div className="text-blue-600 text-sm font-medium">Open tool →</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}