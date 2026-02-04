FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./

# instala tudo (inclui sequelize-cli)
RUN yarn install

COPY . .

EXPOSE 3333

CMD ["node", "src/server.js"]
