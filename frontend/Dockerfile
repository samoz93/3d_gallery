FROM --platform=linux/amd64 node:18-alpine

RUN apk add --no-cache bash
RUN yarn global add pnpm

WORKDIR /frontend

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY . .

ENV NODE_ENV production

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]