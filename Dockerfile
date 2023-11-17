FROM node:latest
RUN npm install -g nodemon ts-node
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm install && mv /usr/src/app/node_modules /node_modules
COPY . /usr/src/app
EXPOSE 8080
CMD [ "nodemon" ]