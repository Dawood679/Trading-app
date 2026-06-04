FROM node:20-bookworm-slim AS base

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl



# create a stage to install dependencies
FROM base AS deps
COPY ./package.json /app/package.json

RUN npm install -g npm@11.14.1

RUN npm install --force

# create a build stage to build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules

COPY . .
RUN npx prisma generate
RUN npm run build

# build stage to run the app
FROM node:20-bookworm-slim AS runner

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/.next /app/.next
#COPY --from=builder /app/public /app/public
#COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

ENV NODE_OPTIONS="--max-old-space-size=2048"

EXPOSE 3000

CMD ["npm","start"]
