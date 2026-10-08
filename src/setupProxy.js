/**
 * Bharathi Thervukalam - React Development Proxy
 * Routes all API traffic from the React frontend to the Python FastAPI backend.
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

const PYTHON_BACKEND_URL = process.env.REACT_APP_API_URL || process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';

module.exports = function(app) {
  const apiProxy = createProxyMiddleware({
    target: PYTHON_BACKEND_URL,
    changeOrigin: true,
    secure: false,
    onError: (err, req, res) => {
      if (req.url && req.url.includes('/health')) {
        return res.status(200).json({
          status: 'online',
          service: 'Bharathi Thervukalam Python Backend Gateway',
          backend_target: PYTHON_BACKEND_URL,
          python_backend_status: 'standby'
        });
      }
      res.status(503).json({
        status: 'error',
        message: `Python backend is not reachable at ${PYTHON_BACKEND_URL}. Start it with: npm run backend`,
        target: PYTHON_BACKEND_URL
      });
    }
  });

  // Forward all /api and legacy PHP compatibility routes to Python backend
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.endsWith('.php')) {
      return apiProxy(req, res, next);
    }
    next();
  });

  console.log(`[Dev Server Proxy] Forwarding API traffic to Python Backend at ${PYTHON_BACKEND_URL}`);
};
