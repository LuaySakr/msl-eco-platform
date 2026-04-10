const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');
const socketService = require('./services/socket.service');
const { routes } = require('./routes/routes');
const errorMiddleware = require('./middleware/error.middleware');

// Initialize mock data service (replaces database)
require('./services/mockData.service');

// Initialize cron jobs
require('./services/cron.service');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

socketService.initializeSocket(io);

app.set('env', config.nodeEnv);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});
  
// API routes
app.use('/api', routes);
  
// Error handling middleware (must be last)
app.use(errorMiddleware);

// Same port probe as CRA (detect-port-alt + HOST) so we bind to a free port when busy.
function loadDetectPort() {
  try {
    return require(path.join(__dirname, '..', 'node_modules', 'detect-port-alt'));
  } catch (_) {
    return require('detect-port-alt');
  }
}

// Start server
if (require.main === module) {
  const detect = loadDetectPort();
  const HOST = process.env.HOST || '0.0.0.0';
  const preferred = config.port;

  detect(preferred, HOST)
    .then((port) => {
      if (port !== preferred) {
        console.warn(
          `[backend] Port ${preferred} is in use; API listening on ${port} instead. ` +
            `Set REACT_APP_BACKEND_URL=http://localhost:${port} or free port ${preferred}.`
        );
      }
      server.listen(port, HOST, () => {
        console.log(`[backend] Server listening on http://localhost:${port}`);
        logger.info(`Server listening on port ${port}`);
        logger.info(`Environment: ${config.nodeEnv}`);
      });
    })
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
}

module.exports = { app, server, io };
