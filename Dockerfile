# 1. Uzimamo laganu verziju Node.js-a
FROM node:18-alpine

# 2. Pravimo radni direktorijum unutar kontejnera
WORKDIR /app

# 3. Kopiramo spisak biblioteka i instaliramo ih
COPY package*.json ./
RUN npm install

# 4. Kopiramo sav ostali kod iz našeg foldera u kontejner
COPY . .

# 5. Otvaramo port 3000 unutar Docker mreže
EXPOSE 3000

# 6. Komanda koja pokreće aplikaciju
CMD ["npm", "start"]
