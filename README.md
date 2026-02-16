# Admin Dashboard

A simple admin panel built with [DummyJSON API](https://dummyjson.com/docs).

## Stack

- **Vite** - build tool
- **TypeScript** - type safety
- **React** - UI
- **MobX** - state management
- **Tailwind CSS** - styling
- **Shadcn/Radix** - UI components
- **Zod** - validation
- **react-hook-form** - forms

## Architecture

The project uses [Feature-Sliced Design](https://feature-sliced.design):

```
src/
├── app/           # Initialization, routing, providers
├── pages/         # Pages (auth, products)
├── features/      # Features (create, edit, delete product)
├── entities/      # Entities (user, product)
├── shared/        # Shared code (api, lib)
└── components/    # UI components (Shadcn)
```

## Features

- **Authentication** - login with token storage, logout
- **Products list** - table with search, sorting, filtering
- **Create product** - modal with form
- **Edit product** - modal
- **Delete product** - confirmation modal
- **Query parameters** - search, filter, sort, take, skip in URL

## Getting Started

```bash
npm install
npm run dev
```

To build:

```bash
npm run build
```

## Test Credentials

Use any credentials from [dummyjson.com/users](https://dummyjson.com/users), for example:

- Username: `emilys`
- Password: `emilyspass`
