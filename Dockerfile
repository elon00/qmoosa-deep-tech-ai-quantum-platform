FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
USER node
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY --chown=node:node . .
RUN npm run build

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
USER node
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && npm cache clean --force
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/company-os ./company-os
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/server.cjs"]
