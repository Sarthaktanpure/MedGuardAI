FROM node:20-alpine

WORKDIR /app

COPY server/package.json /app/server/package.json
COPY server/tsconfig.json /app/server/tsconfig.json
RUN npm install --prefix server

COPY server /app/server

EXPOSE 5000
CMD ["npm", "--prefix", "server", "run", "dev"]
