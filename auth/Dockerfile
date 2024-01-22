FROM node:alpine

# Create app directory
WORKDIR /app

COPY package.json .

RUN yarn global add pnpm && pnpm install --only=prod

COPY . .

EXPOSE 3010

CMD ["pnpm", "start"]