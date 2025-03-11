FROM node:22-bookworm-slim AS dev
WORKDIR /rolimoa

COPY ./client/package*.json ./client/
COPY ./server/package*.json ./server/
RUN npm -C ./client install \
  && npm -C ./server install


# ビルドステージ
FROM dev AS build

COPY . .
RUN npm run -C ./client build


# 実行環境ステージ
FROM node:22-bookworm-slim AS prod
WORKDIR /rolimoa

COPY --from=build /rolimoa/client/dist ./client/dist
COPY --from=build /rolimoa/server ./server

RUN chown -R node:node /rolimoa
USER node
EXPOSE 8000

CMD ["npm", "-C", "./server", "start"]
