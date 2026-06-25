module.exports = {
  apps: [
    {
      name: 'crazy-chips',
      script: 'node',
      args: '.next/standalone/server.js',
      cwd: '/var/www/crazy-chips',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
}
