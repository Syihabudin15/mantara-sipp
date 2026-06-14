module.exports = {
  apps: [
    {
      name: "mantara-sipp",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1, // ⬅️ WAJIB 1
      exec_mode: "fork", // ⬅️ lebih hemat daripada cluster
      autorestart: true,
      watch: false,
      max_memory_restart: "250M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
