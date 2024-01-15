FROM node:latest
WORKDIR /node/autorest
COPY package*.json index.js ./
RUN npm install
EXPOSE 3000
CMD ["node","index.js"]