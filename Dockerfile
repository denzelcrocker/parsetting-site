FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_STANDALONE=1
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ARG SITE_MODE=brochure
ARG SITE_INDEXABLE_BROCHURE
ENV SITE_MODE=$SITE_MODE
ENV SITE_INDEXABLE_BROCHURE=$SITE_INDEXABLE_BROCHURE
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
