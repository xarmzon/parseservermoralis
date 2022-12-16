FROM  node:18-alphine
WORKDIR /usr/app
COPY package*.json .
RUN npm i -g yarn
RUN yarn
COPY ./ .
EXPOSE 1337
CMD ["yarn", "dev"]