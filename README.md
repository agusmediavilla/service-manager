# Organización de la API con Routers y Controllers

Pre-entrega del Sistema Backend de Turnos y Reservas.

El objetivo de esta versión es reorganizar la API separando responsabilidades entre:

- **Routes**: definen los endpoints.
- **Controllers**: reciben `req`, llaman a los managers y responden con `res`.
- **Managers**: manejan la lógica de datos y la persistencia en archivos JSON.

## Tecnologías

- Node.js
- Express
- ESM
- dotenv
- FileSystem con `fs/promises`
- JSON

## Estructura

```text
src/
├── config/
│   └── env.config.js
├── controllers/
│   ├── services.controller.js
│   └── bookings.controller.js
├── managers/
│   ├── ServiceManager.js
│   └── BookingManager.js
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

`.env` no debe subirse al repositorio.

## Ejecución

```bash
npm start
```

o en desarrollo:

```bash
npm run dev
```

## Endpoints de servicios

```text
GET    /api/services
GET    /api/services/:sid
POST   /api/services
PUT    /api/services/:sid
DELETE /api/services/:sid
```

`GET /api/services` acepta los filtros:

```text
?category=salud
?available=true
```

## Endpoints de reservas

```text
POST /api/bookings
GET  /api/bookings/:bid
POST /api/bookings/:bid/services/:sid
```

En `addServiceToBooking` el controller valida que la reserva y el servicio existan antes de llamar al manager.

Si el mismo servicio ya existe dentro de una reserva, se incrementa `quantity`.

## Separación de responsabilidades

### Routers

Los archivos dentro de `routes/` solo relacionan el método HTTP y la URL con una función controller.

No contienen acceso a archivos JSON ni reglas de datos.

### Controllers

Los archivos dentro de `controllers/`:

- leen `req.params`;
- leen `req.query`;
- leen `req.body`;
- llaman al manager correspondiente;
- responden con `res.status().json()`.

### Managers

Los managers:

- no utilizan `req`;
- no utilizan `res`;
- leen y escriben los archivos JSON;
- gestionan altas, consultas, modificaciones y eliminaciones.

## Persistencia

Los datos se almacenan en:

```text
src/data/services.json
src/data/bookings.json
```

## Archivos que no se suben a GitHub

```text
node_modules/
.env
```
