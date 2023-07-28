ARG NODE_VERSION=20.5.0

FROM node:${NODE_VERSION}-alpine as build

WORKDIR /app

# Install dependencies
COPY lerna.json package.json package-lock.json tsconfig.json ./
COPY packages/ui/package.json ./packages/ui/
COPY packages/server/package.json ./packages/server/
COPY packages/common/package.json ./packages/common/
RUN npm ci --no-audit --no-optional

# Build packages
COPY packages/ui ./packages/ui
COPY packages/server ./packages/server
COPY packages/common ./packages/common
RUN npm run build 

FROM node:${NODE_VERSION}-alpine as production

WORKDIR /app

# Copy root dependencies
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

# Copy server dependencies and build
COPY --from=build /app/packages/server/package.json ./packages/server/
COPY --from=build /app/packages/server/node_modules ./packages/server/node_modules
COPY --from=build /app/packages/server/dist ./packages/server/dist

# Copy common dependencies and build
COPY --from=build /app/packages/common/package.json ./packages/common/
COPY --from=build /app/packages/common/dist ./packages/common/dist

# Copy UI build
COPY --from=build /app/packages/ui/build ./uiBuild

CMD ["node", "packages/server/dist/index.js"]

EXPOSE 80