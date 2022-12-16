FROM node:14-alpine

WORKDIR /root/oscMirror

ADD package.json .
ADD package-lock.json .

RUN npm ci

COPY . .

ENTRYPOINT [ "npm", "run", "server" ]
