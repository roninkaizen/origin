FROM node:12-alpine

ARG VERSION=latest

RUN apk --no-cache add make gcc g++ python
RUN npm i -g yarn --force
RUN for i in 1 2 3 4 5; do yarn global add @energyweb/event-listener@${VERSION} && break || sleep 15; done

CMD ["event-listener"]