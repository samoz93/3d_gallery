FROM node:18-alpine As development
RUN apk add --no-cache bash



WORKDIR /api

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./tsconfig*.json ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi
  

COPY . .

RUN pnpm run build

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /api

COPY ./package*.json .
COPY ./package*.json .

RUN yarn global add pnpm && pnpm install

COPY . .

COPY --from=development /api/dist ./api/dist

EXPOSE 3000

CMD ["node", "dist/main"]