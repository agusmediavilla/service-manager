# Refactor del proyecto con arquitectura en capas, DAO y Repository

Pre-entrega del **Sistema Backend de Turnos y Reservas**.

Esta versión reorganiza la API existente utilizando una arquitectura en capas para desacoplar la lógica HTTP, las reglas de negocio y la persistencia.

## Flujo de la aplicación

```text
Router
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
DAO
  ↓
Archivo JSON
```

## Responsabilidad de cada capa

### Router

Define las URLs y los métodos HTTP y los conecta con un controller.

No contiene reglas de negocio ni acceso a archivos.

### Controller

Lee información de:

- `req.params`
- `req.query`
- `req.body`

Llama a la capa Service y construye la respuesta HTTP mediante `res.status().json()`.

### Service

Contiene las reglas de negocio.

No utiliza `req` ni `res` y tampoco accede directamente a archivos JSON.

Ejemplos:

- validación de campos obligatorios;
- generación automática de IDs;
- protección del `id` al actualizar un servicio;
- validación de reserva y servicio;
- incremento de `quantity` si un servicio ya existe dentro de una reserva.

### Repository

Expone métodos de acceso a datos para la capa Service.

No contiene reglas de negocio ni conoce Express.

### DAO

Es la única capa que accede directamente a los archivos JSON mediante `fs/promises`.

## Estructura

```text
src/
├── config/
│   └── env.config.js
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
├── routes/
│   ├── services.router.js
│   └── bookings.router.js
├── data/
│   ├── services.json
│   └── bookings.json
├── app.js
└── server.js
```

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz:

```env
PORT=8080
NODE_ENV=development
```

El archivo `.env` no debe subirse a GitHub.

## Ejecución

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

## Endpoints de services

```text
GET    /api/services
GET    /api/services/:sid
POST   /api/services
PUT    /api/services/:sid
DELETE /api/services/:sid
```

También se mantienen los filtros:

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

Los servicios de una reserva se almacenan de esta forma:

```json
{
  "service": 1,
  "quantity": 1
}
```

Si el servicio `1` se agrega nuevamente, `bookings.service.js` incrementa la cantidad:

```json
{
  "service": 1,
  "quantity": 2
}
```

Esta regla está implementada en la capa **Service**, no en Repository ni DAO.

## Funciones principales

### Services

Controller y Service:

```text
getServices
getServiceById
createService
updateService
deleteService
```

Repository y DAO:

```text
getAll
getById
create
update
delete
```

### Bookings

Controller y Service:

```text
createBooking
getBookingById
addServiceToBooking
```

Repository y DAO:

```text
create
getById
update
```

## Persistencia

Los únicos archivos que trabajan directamente con FileSystem son:

```text
src/dao/services.dao.js
src/dao/bookings.dao.js
```

Los datos se guardan en:

```text
src/data/services.json
src/data/bookings.json
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
