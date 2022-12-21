FROM node:19-alpine as builder

RUN adduser -D wlosiara && \
	mkdir -p /home/wlosiara/app && \
	chown -R wlosiara:wlosiara /home/wlosiara/app

USER wlosiara

WORKDIR /home/wlosiara/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . ./

RUN npm run build

FROM node:19-alpine

RUN adduser -D wlosiara && \
	mkdir -p /home/wlosiara/app && \
	chown -R wlosiara:wlosiara /home/wlosiara/app

USER wlosiara

WORKDIR /home/wlosiara/app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=builder /home/wlosiara/app/build ./build

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
