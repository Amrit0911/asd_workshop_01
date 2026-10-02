# ASD Workshop 01 - Product REST API

A simple RESTful API built with **Node.js** and **Express** that supports full CRUD operations on products, with in-memory TTL-based caching.

## Tech Stack
- Node.js
- Express v5
- Nodemon (dev server)
- File-based JSON storage

## Getting Started

```bash
npm install
npm run dev   # development with auto-reload
npm start     # production
```

## API Endpoints

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/products`       | Get all products         |
| GET    | `/products/:id`   | Get product by ID        |
| POST   | `/products`       | Create a new product     |
| PUT    | `/products/:id`   | Replace a product        |
| PATCH  | `/products/:id`   | Partially update product |
| DELETE | `/products/:id`   | Delete a product         |

## Architecture

```
index.js                  ← Express app & server
src/
  routes/                 ← Route definitions
  controllers/            ← Request/response handling
  services/               ← Business logic
  database/               ← File-based data persistence
  middleware/             ← Caching middleware
data.json                 ← JSON data store
```

## Caching
GET requests are cached in-memory with a 60-second TTL. Cache is invalidated on any write operation (POST, PUT, PATCH, DELETE).
