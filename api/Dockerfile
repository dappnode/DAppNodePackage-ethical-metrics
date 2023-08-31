ARG NODE_VERSION=20.5.0

FROM node:${NODE_VERSION}-alpine as build

# Build a node server and final stage serve it

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/index.js"]
