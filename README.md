# Entrega Final: Sistema Backend de Turnos y Reservas

Proyecto final del curso de Programación Backend.

Integra una API REST completa para administrar servicios y reservas utilizando Node.js, Express, MongoDB Atlas, Mongoose, Zod, Handlebars y Socket.io.

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

La lógica de negocio se mantiene en `services/` y el acceso a datos en `dao/`.

## Instalación rápida

```bash
npm install
```

Crear `.env`:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/turnos
```

Ejecutar:

```bash
npm start
```

Abrir:

```text
http://localhost:8080/views/services
http://localhost:8080/views/bookings
```

## Estructura principal

```text
src/
├── config/
├── controllers/
├── services/
├── repositories/
├── dao/
├── models/
├── routes/
├── middlewares/
├── validators/
├── views/
├── public/
├── app.js
└── server.js
```

## Servicios

Endpoints:

```text
GET    /api/services
GET    /api/services/:sid
POST   /api/services
PUT    /api/services/:sid
DELETE /api/services/:sid
```

Ejemplo de creación:

```json
{
  "name": "Consulta general",
  "description": "Consulta de 30 minutos",
  "duration": 30,
  "price": 15000,
  "category": "salud",
  "available": true
}
```

## Consultas avanzadas

`GET /api/services` acepta:

```text
category
available
page
limit
sortBy
order
```

Ejemplos:

```http
GET /api/services?category=salud
GET /api/services?available=true
GET /api/services?page=2&limit=5
GET /api/services?sortBy=price&order=desc
GET /api/services?category=salud&available=true&page=1&limit=5&sortBy=price&order=asc
```

Respuesta:

```json
{
  "status": "success",
  "payload": [],
  "pagination": {
    "total": 20,
    "page": 1,
    "limit": 5,
    "totalPages": 4,
    "hasPrevPage": false,
    "hasNextPage": true
  }
}
```

## Reservas

Endpoints:

```text
POST /api/bookings
GET  /api/bookings/:bid
POST /api/bookings/:bid/services/:sid
```

Ejemplo:

```json
{
  "clientName": "Juan Perez",
  "clientEmail": "juan@email.com",
  "date": "2026-09-20",
  "time": "10:00",
  "status": "pending"
}
```

## ObjectId y quantity

Las reservas guardan solo referencias:

```js
services: [
  {
    service: ObjectId,
    quantity: Number
  }
]
```

Nunca se persiste el objeto completo del servicio.

Si el mismo servicio se agrega dos veces, `quantity` se incrementa en `bookings.service.js`.

## Populate

`GET /api/bookings/:bid` usa `populate` sobre:

```js
services.service
```

y devuelve datos completos de los servicios relacionados.

## Validación con Zod

Se valida antes de llegar a MongoDB:

```text
POST /api/services
PUT  /api/services/:sid
POST /api/bookings
POST /api/bookings/:bid/services/:sid
```

Los schemas están en:

```text
src/validators/
```

y el middleware en:

```text
src/middlewares/validate.middleware.js
```

## Handlebars

Vistas:

```text
GET /views/services
GET /views/bookings
```

Los datos salen de MongoDB a través de la arquitectura existente.

## Socket.io

Eventos implementados:

```text
serviceCreated
serviceUpdated
serviceDeleted
bookingCreated
bookingUpdated
```

Ejemplo: al crear un servicio con `POST /api/services`, la vista `/views/services` se actualiza sin recargar.

## Cómo probar rápido

1. `npm install`
2. Crear `.env`
3. `npm start`
4. Abrir `/views/services`
5. Crear un servicio con `POST /api/services`
6. Ver que aparece sin recargar
7. Crear una reserva con `POST /api/bookings`
8. Asociar un servicio con `POST /api/bookings/:bid/services/:sid`
9. Consultar `GET /api/bookings/:bid` y verificar el `populate`
10. Probar `GET /api/services?page=1&limit=5&sortBy=price&order=desc`

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

La entrega debe realizarse con la URL pública del repositorio.
