# Vistas con Handlebars y comunicación en tiempo real con Socket.io

Pre-entrega del **Sistema Backend de Turnos y Reservas**.

Esta versión mantiene la API REST y la arquitectura en capas existente, y agrega:

- vistas server-side con Handlebars;
- archivos estáticos en `public`;
- comunicación en tiempo real con Socket.io;
- actualización automática de vistas ante acciones reales del sistema.

## Arquitectura

```text
routes
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

Las vistas también obtienen sus datos respetando este flujo.

## Estructura nueva

```text
src/
├── controllers/
│   └── views.controller.js
├── routes/
│   └── views.router.js
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── services.handlebars
│   └── availability.handlebars
└── public/
    ├── css/
    │   └── styles.css
    └── js/
        └── socket.js
```

El resto de las capas de la API se conserva.

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

No subir `.env` ni credenciales reales.

## Ejecución

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

## Vistas

### Servicios

```text
GET /views/services
```

Renderiza desde MongoDB:

- nombre;
- descripción;
- duración;
- precio;
- categoría;
- disponibilidad.

### Disponibilidad y reservas

```text
GET /views/availability
```

Muestra:

- servicios actualmente disponibles;
- reservas registradas en MongoDB.

No hay datos hardcodeados en los archivos Handlebars.

## Socket.io

Socket.io se configura sobre el servidor HTTP.

El archivo:

```text
src/public/js/socket.js
```

escucha eventos reales del sistema.

### Crear un servicio

Cuando se ejecuta:

```text
POST /api/services
```

y el servicio se crea correctamente en MongoDB, el controller emite:

```text
serviceCreated
```

La vista `/views/services` recibe ese evento y agrega el nuevo servicio sin recargar el navegador.

También se incluyen:

```text
serviceUpdated
serviceDeleted
bookingCreated
bookingUpdated
```

## API REST

La API sigue funcionando:

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

## Modelos Mongoose

Se mantienen:

```text
service.model.js
booking.model.js
message.model.js
```

Las reservas referencian servicios mediante `ObjectId`.

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
