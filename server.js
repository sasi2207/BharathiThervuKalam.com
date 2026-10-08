/**
 * Bharathi Thervukalam - Production React Server & Python API Gateway
 * Serves the React frontend bundle and routes API traffic to the Python backend.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const PYTHON_BACKEND_URL = process.env.REACT_APP_API_URL || process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';

app.use(cors());

// Proxy handler to Python FastAPI Backend
const apiProxy = createProxyMiddleware({
  target: PYTHON_BACKEND_URL,
  changeOrigin: true,
  secure: false,
  onError: (err, req, res) => {
    if (req.url && req.url.includes('/health')) {
      return res.status(200).json({
        status: 'online',
        service: 'Bharathi Thervukalam Python Gateway',
        backend: 'Python FastAPI',
        target: PYTHON_BACKEND_URL
      });
    }
    res.status(503).json({
      status: 'error',
      message: `Python backend is not running at ${PYTHON_BACKEND_URL}. Launch it with: npm run backend`,
      target: PYTHON_BACKEND_URL
    });
  }
});

// Intercept all /api and legacy PHP routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.endsWith('.php')) {
    return apiProxy(req, res, next);
  }
  next();
});

// Serve static React frontend build
const buildPath = path.resolve(__dirname, 'build');
app.use(express.static(buildPath));

// Fallback to React index.html for SPA client-side routing
app.use((req, res) => {
  const indexHtml = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Bharathi Thervukalam</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #061126; color: #f8fafc; text-align: center; padding: 20px; }
          .card { background: #0f1e36; border: 1px solid #1e355b; border-radius: 16px; padding: 32px; max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          h1 { color: #f59e0b; margin-top: 0; }
          p { color: #94a3b8; line-height: 1.6; }
          code { background: #172a4d; color: #fbbf24; padding: 4px 8px; border-radius: 4px; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Bharathi Thervukalam</h1>
          <p>Python Backend Target: <code>${PYTHON_BACKEND_URL}</code></p>
          <p>Run <code>npm run build</code> to compile React frontend bundle.</p>
        </div>
      </body>
    </html>
  `);
});

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`[Server] Bharathi Thervukalam React UI listening at http://${HOST}:${PORT}`);
    console.log(`[Server] Routing API requests to Python Backend: ${PYTHON_BACKEND_URL}`);
  });
}

module.exports = app;
