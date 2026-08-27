const winston = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');

// Create a Winston logger that streams to Google Cloud Logging
const loggingWinston = new LoggingWinston({
  logName: 'career-plus-api_log',
});

const logger = winston.createLogger({
  level: 'info',
  transports: [
    // Log to the console (useful for local dev and standard Cloud Run logs)
    new winston.transports.Console(),
    
    // Add the specialized Google Cloud Logging transport
    ...(process.env.NODE_ENV === 'production' ? [loggingWinston] : [])
  ],
});

module.exports = logger;
