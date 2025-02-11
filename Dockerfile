FROM node:18-alpine
WORKDIR /

ENV PATH /node_modules/.bin:$PATH

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

RUN yarn build

CMD ["sh", "-c", "yarn run migration:run && yarn run start"]