# API inicial de servicios y reservas con FileSystem

Proyecto desarrollado con **Node.js**, **Express**, **ESM** y **FileSystem** para gestionar servicios y reservas de un sistema de turnos.

La información se persiste en archivos JSON, por lo que los datos se conservan aunque el servidor se reinicie.

## Tecnologías

- Node.js
- Express
- JavaScript ESM
- dotenv
- FileSystem (`fs/promises`)
- JSON

## Estructura

```text
src/
├── app.js
├── server.js
├── config/
│   └── env.config.js
├── managers/
│   ├── ServiceManager.js
│   └── BookingManager.js
├── routes/
│   ├── services.router.js
│   └── bookings.router.js
└── data/
    ├── services.json
    └── bookings.json
```

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
NODE_ENV=development
```

El archivo `.env` no debe subirse al repositorio.

## Ejecución

Modo normal:

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

Servidor:

```text
http://localhost:8080
```

# Recurso services

Cada servicio tiene la forma:

```json
{
  "id": 1,
  "name": "Consulta general",
  "description": "Consulta de 30 minutos",
  "duration": 30,
  "price": 15000,
  "category": "salud",
  "available": true
}
```

## Endpoints de servicios

### Obtener todos

```http
GET /api/services
```

También permite filtros:

```http
GET /api/services?category=salud
GET /api/services?available=true
```

### Obtener por ID

```http
GET /api/services/:sid
```

### Crear servicio

```http
POST /api/services
Content-Type: application/json
```

Body:

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

El `id` se genera automáticamente.

### Actualizar servicio

```http
PUT /api/services/:sid
Content-Type: application/json
```

Ejemplo:

```json
{
  "price": 18000,
  "available": false
}
```

El `id` no puede modificarse.

### Eliminar servicio

```http
DELETE /api/services/:sid
```

# Recurso bookings

Cada reserva tiene la forma:

```json
{
  "id": 1,
  "clientName": "Juan Perez",
  "clientEmail": "juan@email.com",
  "date": "2026-09-10",
  "time": "10:00",
  "status": "pending",
  "services": []
}
```

## Crear reserva

```http
POST /api/bookings
Content-Type: application/json
```

Body:

```json
{
  "clientName": "Juan Perez",
  "clientEmail": "juan@email.com",
  "date": "2026-09-10",
  "time": "10:00",
  "status": "pending"
}
```

La reserva puede iniciarse con `services: []`.

## Obtener reserva por ID

```http
GET /api/bookings/:bid
```

## Agregar servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

Antes de agregarlo se valida que:

- la reserva exista;
- el servicio exista.

Dentro de la reserva se almacena solamente:

```json
{
  "service": 1,
  "quantity": 1
}
```

Si se vuelve a agregar el mismo servicio, no se duplica el objeto: se incrementa `quantity`.

Ejemplo:

```json
{
  "service": 1,
  "quantity": 2
}
```

## Persistencia

Los datos se almacenan en:

```text
src/data/services.json
src/data/bookings.json
```

Se utiliza `fs/promises` con `async/await` para leer y escribir los archivos de forma asíncrona.

## GitHub

El repositorio no debe incluir:

```text
node_modules/
.env
```

Sí debe incluir:

```text
.env.example
.gitignore
README.md
package.json
src/
```
