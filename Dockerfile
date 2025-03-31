FROM node:22-bookworm-slim AS dev
WORKDIR /rolimoa

COPY . .
RUN npm ci

# ビルドステージ
FROM dev AS build

RUN npm run build


# 実行環境ステージ
FROM node:22-bookworm-slim AS prod
WORKDIR /rolimoa

COPY --from=build --chown=node:node /rolimoa/ .
RUN npm ci --omit=dev

USER node
CMD ["npm", "start"]
