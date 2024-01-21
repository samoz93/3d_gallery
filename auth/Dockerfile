FROM node:alpine

# Create app directory
WORKDIR /app

COPY package.json .

RUN yarn global add pnpm && pnpm install

COPY . .

EXPOSE 3010

CMD ["pnpm", "start"]