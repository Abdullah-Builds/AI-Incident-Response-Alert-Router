FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate --no-engine

EXPOSE 5000

CMD ["npm", "run", "dev"]   