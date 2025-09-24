"use client"

import { useState } from "react"

export default function TestPage() {
  const [testResult, setTestResult] = useState<{success: boolean; error?: string; data?: unknown} | null>(null)
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">System Test Page</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-2 text-sm">
              <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
              <p><strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL || 'Not set'}</p>
              <p><strong>NEXTAUTH_SECRET:</strong> {process.env.NEXTAUTH_SECRET ? 'Set (hidden)' : 'Not set'}</p>
              <p><strong>DATABASE_URL:</strong> {process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Database Connection Test</h2>
            <button
              onClick={testDatabase}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test Database"}
            </button>
            
            {testResult && (
              <div className={`mt-4 p-4 rounded ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <h3 className="font-semibold">Test Result:</h3>
                <pre className="mt-2 text-sm overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="text-sm space-y-2">
              <p>1. Check that all environment variables are set correctly</p>
              <p>2. Test the database connection</p>
              <p>3. If database test fails, check your DATABASE_URL</p>
              <p>4. If authentication fails, check NEXTAUTH_SECRET and NEXTAUTH_URL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
