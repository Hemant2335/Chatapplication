module.exports = {
  apps: [
    {
      name: "frontend", // Name of the frontend service
      script: "npm", // Use npm as the script executor
      args: "run dev", // Run the "dev" script defined in the frontend's package.json
      cwd: "./frontend", // Set the working directory for the frontend
    },
    {
      name: "backend", // Name of the backend service
      script: "npm", // Use npm as the script executor
      args: "run start", // Run the "start" script defined in the backend's package.json
      cwd: "./backend", // Set the working directory for the backend
    },
    {
      name: "websocket", // Name of the WebSocket service
      script: "npm", // Use npm as the script executor
      args: "run start", // Run the "start" script defined in the WebSocket's package.json
      cwd: "./websocket", // Set the working directory for the WebSocket
    },
  ],
};
