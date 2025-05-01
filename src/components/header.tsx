"use client";

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-800 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <svg
                className="h-8 w-8 text-white mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span className="text-white text-2xl font-bold">DevTools</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            <Link
              href="/tools"
              className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              Tools
            </Link>
            <span
              className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              Blog
            </span>
            <span
              className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              Pricing
            </span>
            <span
              className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              Contact
            </span>
          </nav>

          {/* Auth Buttons */}
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span
              className="px-4 py-2 rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-gray-100 transition-colors"
            >
              Log In
            </span>
            <span
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}