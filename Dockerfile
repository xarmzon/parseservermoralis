FROM  node:18-alpine as build
WORKDIR /usr/app
COPY package.json /usr/app/
COPY yarn.lock /usr/app/
RUN yarn
COPY . /usr/app/

RUN yarn build

EXPOSE 1337
CMD ["yarn", "start"]