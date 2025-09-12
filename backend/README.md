1. ```cd backend```
2. ```npm install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Levantar MONGO (Replica Set)  ```docker compose up -d```
5. Prisma Client ```npx prisma generate```
6. Aplicar Schema ```npx prisma db push```

6. Levantar: 
```
npm run start:dev