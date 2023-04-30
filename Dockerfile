FROM node:16-alpine3.16
RUN mkdir -p /usr/src/medre-be && chown -R node:node /usr/src/medre-be
WORKDIR /usr/src/medre-be
COPY package.json .
USER node
RUN npm install --production
COPY --chown=node:node . .
EXPOSE 6543
CMD [ "npm", "start"]