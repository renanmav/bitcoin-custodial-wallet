FROM oven/bun:1.1.30

WORKDIR /usr/src/app

COPY package.json .
COPY packages/server/package.json ./packages/server/
COPY packages/eslint-config/package.json ./packages/eslint-config/

COPY bun.lockb .

RUN bun install

COPY packages/eslint-config ./packages/eslint-config
COPY packages/server ./packages/server

WORKDIR /usr/src/app/packages/server

EXPOSE 8080

CMD ["bun", "dev"]