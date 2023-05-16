FROM node:16-alpine3.16
RUN mkdir -p /home/dhieu/MEDRE_BE && chown -R node:node /home/dhieu/MEDRE_BE
WORKDIR /home/dhieu/MEDRE_BE
COPY package.json .
USER node
RUN npm install --production
COPY --chown=node:node . .
EXPOSE 6543
CMD [ "npm", "start"]