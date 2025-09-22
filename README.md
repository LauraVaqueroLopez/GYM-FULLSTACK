# GYM-FULLSTACK
# Proyecto Fullstack: React + Express + PostgreSQL

Este es un proyecto fullstack con **React** en el frontend, **Express** en el backend y **PostgreSQL** como base de datos.  
Está organizado como un **monorepo**, con carpetas separadas para frontend y backend, para que varios desarrolladores puedan trabajar simultáneamente sin conflictos.

---

## 📂 Estructura del proyecto

my-fullstack-project/

│
├─ backend/

│   ├─ package.json

│   ├─ server.js

│   ├─ db.js

│   ├─ routes/

│   │   └─ users.js

│   └─ .env


│

├─ frontend/

│   ├─ package.json

│   ├─ public/

│   └─ src/

│       ├─ App.js

│       ├─ index.js

│       └─ components/

│

├─ .gitignore

├─ README.md



**⚙️ Tecnologías usadas**

Frontend: React

Backend: Node.js + Express.js

Base de datos: PostgreSQL

Otros: CORS, dotenv, nodemon

# 🛠️ Instalación y configuración
**1️⃣ Clonar el repositorio**
git clone https://github.com/tu-usuario/my-fullstack-project.git
cd my-fullstack-project

**2️⃣ Configurar e iniciar el Backend**
cd backend
npm install


**Crear un archivo .env con la configuración de PostgreSQL:**

DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_NAME=tu_basedatos
DB_PORT=5432
PORT=5000


**Iniciar el servidor backend:**

npm run dev


**El servidor corre en: http://localhost:5000**

**3️⃣ Configurar e iniciar el Frontend**
cd frontend
npm install
npm start


La app de React corre en: http://localhost:3000

Para conectar el frontend al backend, usa fetch a http://localhost:5000/api/users o configura un proxy en frontend/package.json.

# 🔹 Uso

Ver usuarios: en el frontend, se hace fetch a la ruta /api/users del backend.

Cambiar tema / datos globales: se puede usar React Context para compartir datos entre componentes del frontend.

🧑‍💻 Flujo de trabajo para dos desarrolladores

Cada uno puede trabajar en su carpeta (frontend o backend) para minimizar conflictos.

Crear ramas para features específicas y luego mergearlas.

Hacer git pull frecuente para mantener actualizado el main.

Cada desarrollador puede tener su propia base de datos local .env sin afectar al otro.

# 🔹 Gitignore

Se recomienda tener un solo .gitignore en la raíz del proyecto.

Este .gitignore incluye:

node_modules para backend y frontend

Carpetas de build (frontend/build, backend/dist)

Archivos de entorno .env

Logs y caches de herramientas comunes

Esto mantiene el repositorio limpio y evita subir archivos innecesarios o confidenciales.

# 🔹 Comandos útiles

Backend

npm run dev     # correr con nodemon
npm start       # correr sin nodemon


Frontend

npm start       # levantar servidor de desarrollo
npm run build   # construir para producción

## 📌 Notas importantes

Asegúrate de tener PostgreSQL instalado y corriendo en tu máquina.

Este proyecto usa monorepo: backend y frontend separados, cada uno con sus propias dependencias.

Los .env no deben subirse al repositorio.

**🔹 Flujo de datos**

flowchart LR

    A[Frontend (React)] -->|fetch / axios| B[Backend (Express)]
    
    B -->|consultas SQL| C[PostgreSQL]
    
    C -->|resultado| B
    
    B -->|JSON response| A
    


# Explicación rápida:

Frontend (React): Hace peticiones HTTP al backend usando fetch o axios. Consume la API y muestra datos en componentes.

Backend (Express): Recibe las solicitudes del frontend, consulta la base de datos PostgreSQL usando pg y devuelve los datos en JSON.

PostgreSQL: Base de datos que almacena la información y devuelve resultados al backend.

## 📦 Licencia

MIT License

---
