FROM node:18-alpine As development
RUN apk add --no-cache bash



WORKDIR /api

COPY ./package*.json ./
COPY ./tsconfig*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /api

COPY ./package*.json .
COPY ./package*.json .

RUN npm install

COPY . .

COPY --from=development /api/dist ./api/dist

EXPOSE 3000

CMD ["node", "dist/main"]