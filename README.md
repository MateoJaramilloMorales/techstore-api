# 🚀 TechStore API & Dashboard v2.0

Sistema integral de gestión de inventario y órdenes de venta desarrollado con **Node.js**, **TypeScript** y **PostgreSQL (Supabase)**.

---

## 🏗️ Arquitectura del Proyecto
El sistema sigue el patrón **Controller-Service**, separando la lógica de las rutas de la manipulación de datos:

* **`app.ts`**: Punto de entrada y definición de rutas.
* **`src/services/`**: Capa de lógica de negocio y consultas SQL.
* **`Dashboard GUI`**: Interfaz administrativa con diseño *Clean SaaS*.

---

## 🛠️ Tecnologías
* **Backend**: Node.js / Express / TypeScript.
* **Base de Datos**: Supabase (PostgreSQL).
* **Frontend**: SSR con Tailwind CSS.
* **Integraciones**: PokeAPI.

---

## 📡 Endpoints Principales

### 📦 Productos
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/products` | Listar inventario |
| `POST` | `/products` | Crear producto |
| `PATCH` | `/products/:id` | Editar precio/stock |

### 🧾 Órdenes
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/orders` | Procesar venta (Cálculo automático) |
| `GET` | `/orders` | Historial de ventas |

---

## 🧪 Guía de Pruebas (Orden Crítico)
Para evitar errores de "Producto no existe", ejecute en este orden:

1.  **Categoría**: `POST /categories` -> `{"name": "Gaming"}`
2.  **Producto**: `POST /products` -> `{"name": "Teclado", "price": 50, "stock": 10, "category_id": 1}`
3.  **Orden**: `POST /orders` -> `{"customerName": "Mateo", "items": [{"productId": 1, "quantity": 1}]}`

---

## 🧹 Limpieza de Base de Datos (Supabase)
Si deseas reiniciar los IDs a 1, ejecuta en el SQL Editor:
```sql
TRUNCATE TABLE orders, products, categories RESTART IDENTITY CASCADE;