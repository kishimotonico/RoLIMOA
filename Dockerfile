FROM node:22-bookworm-slim AS base
WORKDIR /rolimoa

COPY package*.json ./
COPY packages/common/package*.json ./packages/common/
COPY packages/client/package*.json ./packages/client/
COPY packages/server/package*.json ./packages/server/


# 開発環境ステージ
FROM base AS dev

RUN --mount=type=cache,target=/root/.npm npm ci


# ビルドステージ
FROM dev AS build

COPY . .
RUN npm run build


# 実行環境ステージ
FROM base AS prod

ENV NODE_ENV=production
ENV PORT=8000

COPY --from=build /rolimoa/packages/common/dist ./packages/common/dist
COPY --from=build /rolimoa/packages/client/dist ./packages/client/dist
COPY --from=build /rolimoa/packages/server/dist ./packages/server/dist
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --workspace=@rolimoa/server \
    && chown -R node:node .

USER node
EXPOSE ${PORT}
CMD ["npm", "start"]

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "node", "-e", \
    "fetch(`http://localhost:${process.env.PORT || '8000'}`).then((res) => res.ok || Promise.reject()).catch(() => { process.exit(1); })" \
]
