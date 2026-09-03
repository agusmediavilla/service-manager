# Diseño de endpoints REST para servicios

API REST desarrollada con Node.js y Express para gestionar el recurso `services` de un sistema de turnos y reservas.

## Tecnologías

- Node.js
- Express
- ESM (`import` / `export`)
- dotenv
- FileSystem con archivo JSON

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con:

```env
PORT=8080
NODE_ENV=development
```

El archivo `.env` no debe subirse al repositorio. Se incluye `.env.example` como referencia.

## Ejecución

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

## Recurso `services`

Cada servicio tiene la siguiente estructura:

```json
{
  "id": 1,
  "name": "Consulta general",
  "description": "Consulta inicial de evaluación",
  "duration": 30,
  "price": 12000,
  "category": "salud",
  "available": true
}
```

El `id` se genera automáticamente al crear un servicio.

## Endpoints

### Obtener todos los servicios

```http
GET /api/services
```

Filtros disponibles:

```http
GET /api/services?category=salud
GET /api/services?available=true
GET /api/services?category=salud&available=true
```

### Obtener un servicio por ID

```http
GET /api/services/:sid
```

Devuelve `200` si existe y `404` si no existe.

### Crear un servicio

```http
POST /api/services
Content-Type: application/json
```

Ejemplo de body:

```json
{
  "name": "Masaje deportivo",
  "description": "Sesión de recuperación muscular",
  "duration": 60,
  "price": 20000,
  "category": "bienestar",
  "available": true
}
```

No se debe enviar `id`. El servidor lo genera automáticamente.

Devuelve `201` si se crea correctamente y `400` si faltan campos obligatorios.

### Actualizar un servicio

```http
PUT /api/services/:sid
Content-Type: application/json
```

Ejemplo:

```json
{
  "price": 22000,
  "available": false
}
```

Si se envía un campo `id`, el manager lo ignora y conserva el identificador original.

Devuelve `200` si existe y `404` si no existe.

### Eliminar un servicio

```http
DELETE /api/services/:sid
```

Devuelve `200` si se elimina y `404` si el servicio no existe.

## Organización

- `src/routes/services.router.js`: define los endpoints y utiliza `req.params`, `req.query` y `req.body`.
- `src/managers/ServiceManager.js`: contiene la lógica de gestión y persistencia de servicios.
- `src/app.js`: configura Express y monta el router.
- `src/server.js`: levanta el servidor usando el puerto definido en `.env`.
- `src/config/env.config.js`: carga y valida las variables de entorno.

## GitHub

No subir al repositorio:

- `node_modules/`
- `.env`
- credenciales reales
