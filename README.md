# Consultas avanzadas, validación y relaciones con populate

Pre-entrega del **Sistema Backend de Turnos y Reservas**.

Esta versión profesionaliza la API incorporando:

- filtros avanzados;
- paginación;
- ordenamiento;
- validación previa con Zod;
- relaciones entre reservas y servicios mediante `ObjectId`;
- consultas de reservas con `populate`.

## Arquitectura

```text
routes
  ↓
middlewares de validación
  ↓
controllers
  ↓
services
  ↓
repositories
  ↓
DAO
  ↓
models
  ↓
MongoDB Atlas
```

## Instalación

```bash
npm install
```

## Variables de entorno

Crear `.env`:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/turnos
```

No subir `.env`.

---

# GET /api/services

Acepta:

```text
category
available
page
limit
sortBy
order
```

## Ejemplos

Filtrar por categoría:

```http
GET /api/services?category=salud
```

Filtrar por disponibilidad:

```http
GET /api/services?available=true
```

Paginación:

```http
GET /api/services?page=2&limit=5
```

Ordenar por precio ascendente:

```http
GET /api/services?sortBy=price&order=asc
```

Ordenar por precio descendente:

```http
GET /api/services?sortBy=price&order=desc
```

Combinar consultas:

```http
GET /api/services?category=salud&available=true&page=1&limit=5&sortBy=price&order=asc
```

## Respuesta

Ejemplo:

```json
{
  "status": "success",
  "payload": [],
  "pagination": {
    "total": 24,
    "page": 1,
    "limit": 5,
    "totalPages": 5,
    "hasPrevPage": false,
    "hasNextPage": true
  }
}
```

---

# Validaciones con Zod

Se utilizan schemas independientes dentro de:

```text
src/validators/
```

y middleware:

```text
src/middlewares/validate.middleware.js
```

Las validaciones se ejecutan antes de llegar al controller y antes de acceder a MongoDB.

## Crear servicio

Valida:

```text
name
description
duration
price
category
available
```

## Actualizar servicio

Permite únicamente:

```text
name
description
duration
price
category
available
```

No permite `_id` ni campos desconocidos.

## Crear reserva

Valida:

```text
clientName
clientEmail
date
time
status
```

Además valida formato correcto de email.

## Agregar servicio a reserva

Valida los parámetros:

```text
bid
sid
```

Si la validación falla, responde:

```http
400 Bad Request
```

con un mensaje descriptivo.

---

# Reservas y populate

Las reservas guardan servicios así:

```js
services: [
  {
    service: ObjectId,
    quantity: Number
  }
]
```

No se guarda el objeto completo.

Cuando se consulta:

```http
GET /api/bookings/:bid
```

el DAO utiliza:

```js
.populate({
  path: 'services.service',
  select: 'name description duration price category available'
})
```

Por lo tanto la respuesta contiene los datos completos del servicio asociado.

Ejemplo conceptual:

```json
{
  "status": "success",
  "payload": {
    "_id": "BOOKING_ID",
    "clientName": "Juan Pérez",
    "clientEmail": "juan@email.com",
    "date": "2026-09-10",
    "time": "10:00",
    "status": "pending",
    "services": [
      {
        "service": {
          "_id": "SERVICE_ID",
          "name": "Consulta general",
          "description": "Consulta de 30 minutos",
          "duration": 30,
          "price": 15000,
          "category": "salud",
          "available": true
        },
        "quantity": 2
      }
    ]
  }
}
```

---

# Endpoints existentes

Se mantienen:

```text
GET    /api/services
GET    /api/services/:sid
POST   /api/services
PUT    /api/services/:sid
DELETE /api/services/:sid

POST   /api/bookings
GET    /api/bookings/:bid
POST   /api/bookings/:bid/services/:sid
```

## GitHub

No subir:

```text
node_modules/
.env
```

Sí subir:

```text
src/
package.json
.env.example
.gitignore
README.md
```
