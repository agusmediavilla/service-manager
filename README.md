# Migración a MongoDB con Mongoose

Pre-entrega del **Sistema Backend de Turnos y Reservas**.

Esta versión migra la persistencia desde archivos JSON hacia **MongoDB Atlas** utilizando **Mongoose**, manteniendo los mismos endpoints y la arquitectura en capas.

## Arquitectura

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
DAO
  ↓
Mongoose / MongoDB Atlas
```

La migración cambia únicamente la persistencia. La API mantiene el mismo comportamiento externo.

## Estructura

```text
src/
├── config/
│   ├── env.config.js
│   └── db.config.js
├── controllers/
│   ├── services.controller.js
│   └── bookings.controller.js
├── services/
│   ├── services.service.js
│   └── bookings.service.js
├── repositories/
│   ├── services.repository.js
│   └── bookings.repository.js
├── dao/
│   ├── services.dao.js
│   └── bookings.dao.js
├── models/
│   ├── service.model.js
│   ├── booking.model.js
│   └── message.model.js
├── routes/
│   ├── services.router.js
│   └── bookings.router.js
├── app.js
└── server.js
```

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env`:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/turnos
```

No subir `.env` al repositorio.

`.env.example` contiene únicamente los nombres de las variables:

```env
PORT=
NODE_ENV=
MONGO_URI=
```

## MongoDB Atlas

Para ejecutar el proyecto se necesita una base de datos de MongoDB Atlas.

Pasos generales:

1. Crear un cluster.
2. Crear un usuario de base de datos.
3. Configurar Network Access.
4. Copiar la connection string.
5. Guardarla en `MONGO_URI` dentro de `.env`.

Nunca guardar la URI real dentro del código o del repositorio.

## Modelos

### Service

Campos:

```text
name
description
duration
price
category
available
```

MongoDB genera `_id` automáticamente.

### Booking

Campos:

```text
clientName
clientEmail
date
time
status
services
```

Los servicios se almacenan como referencias:

```js
services: [
  {
    service: ObjectId,
    quantity: Number
  }
]
```

El campo `service` referencia al modelo `Service`.

### Message

Modelo separado requerido para el recurso `messages`.

Campos:

```text
user
message
```

## Endpoints de services

```text
GET    /api/services
GET    /api/services/:sid
POST   /api/services
PUT    /api/services/:sid
DELETE /api/services/:sid
```

Filtros disponibles:

```text
GET /api/services?category=salud
GET /api/services?available=true
```

## Endpoints de bookings

```text
POST /api/bookings
GET  /api/bookings/:bid
POST /api/bookings/:bid/services/:sid
```

## Regla de negocio de reservas

Cuando se agrega un servicio a una reserva:

1. se valida que exista la reserva;
2. se valida que exista el servicio;
3. se almacena únicamente su `ObjectId`;
4. si ese servicio ya estaba en la reserva, se incrementa `quantity`.

Ejemplo:

```json
{
  "services": [
    {
      "service": "66a123456789abcdef123456",
      "quantity": 2
    }
  ]
}
```

La lógica de incremento permanece en:

```text
src/services/bookings.service.js
```

No está implementada en el DAO.

## Separación de responsabilidades

### Routes

Definen los endpoints.

### Controllers

Trabajan con `req` y `res`.

### Services

Contienen reglas de negocio.

### Repositories

Desacoplan la lógica de negocio de la persistencia.

### DAO

Utilizan los modelos de Mongoose para consultar MongoDB.

### Models

Definen los schemas y modelos de Mongoose.

## Ejecución

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
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
