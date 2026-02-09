module.exports = {
  apps: [
    {
      // ========== HTTP Configuration ==========
      name: 'inventory-api-http',
      script: './main.js',
      instances: 'max',
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
        USE_HTTPS: 'false',
        SERVER_HOST: 'localhost',
        
        // Database Configuration (update these)
        DB_HOST: 'your-db-server',
        DB_PORT: '5432',
        DB_USER: 'admin',
        DB_PASSWORD: 'your-password',
        DB_NAME: 'inventory_db',
      },
      
      // Logging
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto-restart on crash
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
    },
    
    {
      // ========== HTTPS Configuration ==========
      name: 'inventory-api-https',
      script: './main.js',
      instances: 'max',
      exec_mode: 'cluster',
      
      // Environment variables for HTTPS
      env: {
        NODE_ENV: 'production',
        PORT: 8443,
        USE_HTTPS: 'true',
        SERVER_HOST: 'localhost',
        HTTPS_CERT_PATH: './certs/cert.pem',
        HTTPS_KEY_PATH: './certs/key.pem',
        
        // Database Configuration
        DB_HOST: 'your-db-server',
        DB_PORT: '5432',
        DB_USER: 'admin',
        DB_PASSWORD: 'your-password',
        DB_NAME: 'inventory_db',
      },
      
      // Logging
      error_file: './logs/error-https.log',
      out_file: './logs/out-https.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto-restart on crash
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      
      // Watch for file changes (set to true only in development)
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'certs'],
    },
  ],

  // Deploy configuration (optional)
  deploy: {
    production: {
      user: 'admin',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:yourrepo/inventory-backend.git',
      path: '/var/www/inventory-api',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
