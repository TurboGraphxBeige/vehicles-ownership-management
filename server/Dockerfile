FROM node:24 AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env ./

RUN npm install
COPY . .

RUN npm run build

# Production image
FROM node:24

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./
RUN npm install --production

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/server.js"]

