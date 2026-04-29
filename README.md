# test-fullstack-playsparts

## Тестовые пользователи

- `user@test.com / password123`
- `admin@test.com / password123`

## Быстрый запуск

```bash
docker compose up -d

cd test-fullstack-playsparts/apps/backend
npm install
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
npm run prisma:seed
npm run start:dev

cd test-fullstack-playsparts/apps/frontend
npm install
npm run dev
```

## Адреса

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`
