FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install typescript
RUN npm run build
RUN npm install nodemon 
RUN npm install ts-node
CMD ["npm", "start"]