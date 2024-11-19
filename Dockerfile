# Stage 1: Build Frontend
FROM node:20 as frontend
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
RUN npm install typescript
COPY . .    

# Stage 2: Prepare Backend
FROM node:20 as backend
WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install
COPY . .
RUN npm install typescript
COPY ./backend/prisma/schema.prisma ./prisma/
RUN npx prisma generate --schema=./prisma/schema.prisma
COPY ./backend ./     


# Stage 3: Prepare WebSocket
FROM node:20 as websocket
WORKDIR /app
COPY ./WebSocket/package.json ./ 
RUN npm install
RUN npm install ts-node
COPY ./WebSocket ./               

# Final Stage: Combine and Run All Services
FROM node:20

WORKDIR /app

# Copy the built frontend files
COPY --from=frontend /app /app/frontend

# Copy the backend and websocket files
COPY --from=backend /app /app/backend
COPY --from=websocket /app /app/websocket
# Copy the startup script
COPY runscript.sh /app/start.sh
RUN chmod +x /app/start.sh

# Install global dependencies
RUN npm install nodemon -g
RUN npm install ts-node -g

# Expose the necessary ports
EXPOSE 3000 5123 8080

# Start the services
CMD ["/app/start.sh"]
