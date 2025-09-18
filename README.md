# Sistema Web de Apoyo al Aprendizaje de la Lengua de Señas Boliviana

Este proyecto es un **sistema web fullstack** desarrollado en **Angular 20** (frontend) y un backend en **Flask/Python**. Permite a los usuarios aprender y practicar la lengua de señas boliviana, con soporte de **predicción de gestos usando MediaPipe** y almacenamiento de resultados.  

---

## 📂 Estructura del Proyecto

### 1. `src/app/core/` – Configuración y servicios globales
- **config/** → configuraciones globales (URLs, constantes).
  - `api.config.ts`  
- **guards/** → control de rutas y permisos.
  - `auth.guard.ts`  
  - `role.guard.ts`  
- **interceptors/** → interceptores HTTP.
  - `auth.interceptor.ts` → agrega JWT a requests.
  - `error.interceptor.ts` → manejo global de errores.  
- **models/** → interfaces TypeScript globales.
  - `user.model.ts`, `auth-response.model.ts`, `prediction.model.ts`  
- **services/** → servicios globales.
  - `api.service.ts`, `auth.service.ts`, `storage.service.ts`  

### 2. `src/app/features/` – Funcionalidades por módulo
Cada feature es **una pantalla o dominio** de la app:

- **auth/** → login, registro, recuperación de cuenta.
  - login.component.ts / html / css  
  - register.component.ts  
  - auth.routes.ts  

- **modulos/** → listado de lecciones o módulos.
  - modulos.component.ts / html / css  

- **learning/** → pantalla de aprendizaje interactivo.
  - learning.component.ts / html / css  

- **prediction/** → predicción de gestos con MediaPipe.
  - hand-prediction.component.ts / html / css  

### 3. `src/app/shared/` – Componentes y utilidades reutilizables
- **components/** → UI reutilizable (navbar, loader, etc.)
- **directives/** → directivas personalizadas (autofocus, etc.)
- **pipes/** → pipes reutilizables (safe-url.pipe.ts)
- **utils/** → helpers y validaciones generales  

### 4. Rutas y configuración global
- `app.routes.ts` → rutas principales de la app.
- `app.config.ts` → providers globales (interceptores, pipes, etc.)
- `app.component.ts` → componente raíz de la app.  

---

## ⚙️ Instalación y ejecución

1. **Clonar el repositorio:**
```bash
git clone <URL_DEL_REPO>
cd mi-proyecto

2. Instalar dependencias:

npm install


3. Ejecutar la app en modo desarrollo:

ng serve


4. Abrir en el navegador: http://localhost:4200

Backend (Flask/Python)

1. Ir a la carpeta del backend.

2. Instalar dependencias:

pip install -r requirements.txt


Ejecutar:

python app.py
##
Para iconos fontawesome