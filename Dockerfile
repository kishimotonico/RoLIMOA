FROM node:22-bookworm-slim as base

WORKDIR /rolimoa
COPY . .

RUN npm -C ./client install  \
  && npm -C ./server install  \
  && npm run -C ./client build

EXPOSE 8000

CMD ["npm", "-C", "./server", "start"]
