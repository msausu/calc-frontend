FROM node:20.11.1-alpine3.19 AS build

WORKDIR /app

COPY package.json ./

RUN npm i

ENV PATH /app/node_modules/.bin:$PATH

COPY . .
COPY .env .env

RUN npm run build

FROM nginx:stable-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/html/

EXPOSE 3000

ENTRYPOINT ["nginx","-g","daemon off;"]
