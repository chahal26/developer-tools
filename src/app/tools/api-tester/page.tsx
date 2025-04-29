"use client";

import { useState } from "react";

export default function ApiTester() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [requestBody, setRequestBody] = useState("");
  const [headers, setHeaders] = useState<string>("{}");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleRequest = async () => {
    setResponse(null);
    setError("");

    // Parse headers input as JSON
    let parsedHeaders = {};
    try {
      parsedHeaders = JSON.parse(headers);
    } catch {
      setError("Invalid JSON format in headers.");
      return;
    }

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...parsedHeaders, // Add the parsed headers here
      },
      body: method !== "GET" ? JSON.stringify(JSON.parse(requestBody || "{}")) : null,
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setResponse(data);
    } catch {
      setError("An error occurred while making the request.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">API Tester</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between mb-4">
          <div className="w-full mr-4">
            <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
              API Endpoint
            </label>
            <input
              type="text"
              id="url"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter API URL"
            />
          </div>

          <div className="w-1/4 ml-4">
            <label htmlFor="method" className="block text-sm font-semibold text-gray-700 mb-2">
              Method
            </label>
            <select
              id="method"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </div>

        {method !== "GET" && (
          <div className="mb-4">
            <label htmlFor="request-body" className="block text-sm font-semibold text-gray-700 mb-2">
              Request Body (JSON)
            </label>
            <textarea
              id="request-body"
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={5}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder='{"key": "value"}'
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="headers" className="block text-sm font-semibold text-gray-700 mb-2">
            Headers (JSON)
          </label>
          <textarea
            id="headers"
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows={5}
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            placeholder='{"Authorization": "Bearer token"}'
          />
        </div>

        <button
          onClick={handleRequest}
          className="w-full bg-blue-500 text-white p-2 rounded-lg"
        >
          Send Request
        </button>
      </div>

      {/* Response Section */}
      {response && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Response</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm font-mono">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {/* Error Section */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
