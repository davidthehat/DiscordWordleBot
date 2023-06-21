# syntax=docker/dockerfile:1
   
FROM node
WORKDIR /app
COPY . .
RUN npm install
RUN apt update && apt install -y ffmpeg
CMD ["npm", "start"]
EXPOSE 3000