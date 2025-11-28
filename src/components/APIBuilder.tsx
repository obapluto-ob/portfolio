import React, { useState } from 'react'
import { Play, Copy, Download, Zap, Database, Globe } from 'lucide-react'

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
}

const APIBuilder: React.FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [currentEndpoint, setCurrentEndpoint] = useState<Endpoint>({
    method: 'GET',
    path: '',
    description: ''
  })
  const [apiName, setApiName] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [showCode, setShowCode] = useState(false)

  const addEndpoint = () => {
    if (currentEndpoint.path && currentEndpoint.description) {
      setEndpoints([...endpoints, currentEndpoint])
      setCurrentEndpoint({ method: 'GET', path: '', description: '' })
    }
  }

  const removeEndpoint = (index: number) => {
    setEndpoints(endpoints.filter((_, i) => i !== index))
  }

  const generateAPI = () => {
    const code = `// ${apiName || 'My API'} - Generated REST API
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

${endpoints.map(endpoint => `
// ${endpoint.description}
app.${endpoint.method.toLowerCase()}('${endpoint.path}', (req, res) => {
  try {
    ${endpoint.method === 'GET' ? 
      `// Fetch data logic here
    res.json({ message: 'Data retrieved successfully', data: [] });` :
      endpoint.method === 'POST' ?
      `// Create new resource
    const newItem = req.body;
    res.status(201).json({ message: 'Created successfully', data: newItem });` :
      endpoint.method === 'PUT' ?
      `// Update existing resource
    const updatedItem = req.body;
    res.json({ message: 'Updated successfully', data: updatedItem });` :
      `// Delete resource
    res.json({ message: 'Deleted successfully' });`
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`).join('')}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 ${apiName || 'API'} running on port \${PORT}\`);
});

export default app;`

    setGeneratedCode(code)
    setShowCode(true)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
  }

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${apiName || 'api'}.js`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-900 rounded-lg border border-purple-500 overflow-hidden">
        <div className="bg-purple-600 p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Database className="w-6 h-6" />
            <h3 className="text-xl font-bold">API Builder</h3>
          </div>
          <p className="text-sm opacity-90">Design and generate REST API code instantly</p>
        </div>

        <div className="p-6 space-y-6">
          {/* API Name */}
          <div>
            <label className="block text-sm font-medium mb-2">API Name</label>
            <input
              type="text"
              value={apiName}
              onChange={(e) => setApiName(e.target.value)}
              placeholder="e.g., User Management API"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          {/* Add Endpoint */}
          <div className="bg-gray-800 p-4 rounded border">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Add Endpoint
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={currentEndpoint.method}
                onChange={(e) => setCurrentEndpoint({...currentEndpoint, method: e.target.value as any})}
                className="p-2 bg-gray-700 border border-gray-600 rounded"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="text"
                value={currentEndpoint.path}
                onChange={(e) => setCurrentEndpoint({...currentEndpoint, path: e.target.value})}
                placeholder="/api/users"
                className="p-2 bg-gray-700 border border-gray-600 rounded"
              />
              <input
                type="text"
                value={currentEndpoint.description}
                onChange={(e) => setCurrentEndpoint({...currentEndpoint, description: e.target.value})}
                placeholder="Get all users"
                className="p-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <button
              onClick={addEndpoint}
              disabled={!currentEndpoint.path || !currentEndpoint.description}
              className="mt-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded text-sm transition-colors"
            >
              Add Endpoint
            </button>
          </div>

          {/* Endpoints List */}
          {endpoints.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Endpoints ({endpoints.length})</h4>
              <div className="space-y-2">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        endpoint.method === 'GET' ? 'bg-green-600' :
                        endpoint.method === 'POST' ? 'bg-blue-600' :
                        endpoint.method === 'PUT' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-sm">{endpoint.path}</span>
                      <span className="text-gray-400 text-sm">{endpoint.description}</span>
                    </div>
                    <button
                      onClick={() => removeEndpoint(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={generateAPI}
              disabled={endpoints.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <Zap className="w-4 h-4" />
              Generate API Code
            </button>
          </div>

          {/* Generated Code */}
          {showCode && (
            <div className="bg-black rounded border">
              <div className="flex justify-between items-center p-3 border-b border-gray-700">
                <span className="font-medium">Generated API Code</span>
                <div className="flex gap-2">
                  <button
                    onClick={copyCode}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                  <button
                    onClick={downloadCode}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
              <pre className="p-4 text-sm text-green-400 overflow-x-auto max-h-96">
                {generatedCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default APIBuilder