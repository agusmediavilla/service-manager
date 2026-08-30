# Service Manager - Pre-entrega Node.js

Proyecto desarrollado con **Node.js** y **ECMAScript Modules (ESM)** para administrar los servicios de un sistema de turnos y reservas.

La aplicación implementa una clase `ServiceManager` que permite consultar, agregar, modificar y eliminar servicios almacenados en un archivo JSON.

## Tecnologías

- Node.js
- JavaScript ES Modules
- dotenv
- File System (`fs/promises`)
- JSON

## Estructura del proyecto

```text
service-manager-preentrega/
├── src/
│   ├── config/
│   │   └── env.config.js
│   ├── managers/
│   │   └── ServiceManager.js
│   ├── data/
│   │   └── services.json
│   └── app.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

> El archivo `.env` se utiliza localmente pero no debe subirse al repositorio.

## Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
cd service-manager-preentrega
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

```env
PORT=8080
NODE_ENV=development
```

Variables requeridas:

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto configurado para la aplicación. |
| `NODE_ENV` | Entorno de ejecución, por ejemplo `development`. |

El archivo `src/config/env.config.js` verifica estas variables al iniciar. Si falta alguna, la aplicación finaliza mostrando un mensaje de error.

## Ejecución

Modo normal:

```bash
npm start
```

Modo desarrollo con reinicio automático de Node.js:

```bash
npm run dev
```

## Recurso `services`

Cada servicio posee la siguiente estructura:

```js
{
  id,
  name,
  description,
  duration,
  price,
  category,
  available
}
```

Ejemplo:

```json
{
  "id": 1,
  "name": "Consulta general",
  "description": "Consulta inicial para evaluar las necesidades del cliente.",
  "duration": 30,
  "price": 15000,
  "category": "Consultas",
  "available": true
}
```

## ServiceManager

Importación:

```js
import ServiceManager from './managers/ServiceManager.js';

const serviceManager = new ServiceManager();
```

### Obtener todos los servicios

```js
const services = await serviceManager.getServices();
console.log(services);
```

### Obtener un servicio por ID

```js
const service = await serviceManager.getServiceById(1);

if (!service) {
  console.log('Servicio no encontrado');
} else {
  console.log(service);
}
```

### Agregar un servicio

El ID se genera automáticamente dentro de `ServiceManager`. No debe enviarse desde afuera.

```js
const newService = await serviceManager.addService({
  name: 'Corte de cabello',
  description: 'Servicio de corte de cabello personalizado.',
  duration: 45,
  price: 18000,
  category: 'Peluquería',
  available: true,
});

console.log(newService);
```

Los campos obligatorios son:

- `name`
- `description`
- `duration`
- `price`
- `category`
- `available`

Si falta alguno, el método genera un error indicando cuáles son los campos faltantes.

### Actualizar un servicio

```js
const updatedService = await serviceManager.updateService(1, {
  price: 20000,
  available: false,
});

if (!updatedService) {
  console.log('Servicio no encontrado');
} else {
  console.log(updatedService);
}
```

Aunque se envíe un campo `id` dentro de `updatedData`, el método no modifica el identificador original.

### Eliminar un servicio

```js
const deletedService = await serviceManager.deleteService(1);

if (!deletedService) {
  console.log('Servicio no encontrado');
} else {
  console.log('Servicio eliminado:', deletedService);
}
```

## Consideraciones para la entrega

El repositorio público de GitHub no debe incluir:

- `node_modules/`
- `.env`
- credenciales reales

Estos archivos están contemplados en `.gitignore`.

El archivo `.env.example` sí debe subirse al repositorio porque documenta las variables de entorno necesarias sin exponer valores locales.
