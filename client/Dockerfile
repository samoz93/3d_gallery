FROM node:alpine


WORKDIR /app 
COPY package.json .
RUN yarn global add pnpm && pnpm install --only=prod

COPY . .

EXPOSE 3001

CMD ["pnpm", "run", "dev"]
