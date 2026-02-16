# Admin Dashboard

Проста адмін панель з використанням [DummyJSON API](https://dummyjson.com/docs).

## Стек

- **Vite** - збірка
- **TypeScript** - типізація
- **React** - UI
- **MobX** - управління станом
- **Tailwind CSS** - стилі
- **Shadcn/Radix** - UI компоненти
- **Zod** - валідація
- **react-hook-form** - форми

## Архітектура

Проєкт використовує [Feature-Sliced Design](https://feature-sliced.design):

```
src/
├── app/           # Ініціалізація, роутинг, провайдери
├── pages/         # Сторінки (auth, products)
├── features/      # Фічі (create, edit, delete product)
├── entities/      # Сущності (user, product)
├── shared/        # Спільний код (api, lib)
└── components/    # UI компоненти (Shadcn)
```

## Функціонал

- **Авторизація** - логін зі збереженням токену, logout
- **Список товарів** - таблиця з пошуком, сортуванням, фільтрацією
- **Створення товару** - модалка з формою
- **Редагування товару** - модалка
- **Видалення товару** - модалка підтвердження
- **Query-параметри** - search, filter, sort, take, skip в URL

## Запуск

```bash
npm install
npm run dev
```

Для збірки:

```bash
npm run build
```

## Тестові облікові дані

Використовуйте будь-які credentials з [dummyjson.com/users](https://dummyjson.com/users), наприклад:

- Username: `emilys`
- Password: `emilyspass`
