FROM node:10 AS ui-build
WORKDIR /usr/src/app
COPY my-app/ ./my-app/
RUN cd my-app && npm install @angular/cli && npm install && npm run build

FROM node:10 AS server-build
WORKDIR /root/
COPY . .
COPY --from=ui-build /usr/src/app/my-app/dist ./my-app/dist
RUN ls -la /root/my-app/dist/projekt1FilterFront*
COPY package*.json ./
RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install
EXPOSE 3080

CMD ["ts-node", "./src/server.ts"]







