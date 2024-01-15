FROM node:latest
WORKDIR /node
RUN git clone https://github.com/pwasystem/autorest.git .
RUN npm install
EXPOSE 3000
CMD ["node","index.js"]