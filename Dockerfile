FROM node:22-bookworm-slim AS dev
WORKDIR /rolimoa

COPY . .
RUN --mount=type=cache,target=/root/.npm npm ci

# ビルドステージ
FROM dev AS build

RUN npm run build


# 実行環境ステージ
FROM node:22-bookworm-slim AS prod
WORKDIR /rolimoa

ENV NODE_ENV=production
ENV PORT=8000

COPY --from=build --chown=node:node /rolimoa/ .
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

USER node
EXPOSE ${PORT}
CMD ["npm", "start"]

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "node", "-e", \
    "fetch(`http://localhost:${process.env.PORT || '8000'}`).then((res) => res.ok || Promise.reject()).catch(() => { process.exit(1); })" \
]
