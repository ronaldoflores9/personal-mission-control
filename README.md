# Centro de Mando — regalo para Alexandra 🚀

Un sitio hecho con [Astro](https://astro.build) como regalo: un centro de mando
personal para organizar misiones, horario y motivación, con temática de
cohetería.

## Qué incluye

- **Centro de mando** (`/`) — panel principal con parche de misión personalizado
  y cuenta regresiva a la próxima fecha importante.
- **Tablero de misión** (`/board`) — scrumboard con columnas Pre-vuelo / En vuelo
  / Aterrizado. Arrastra y suelta o usa las flechas.
- **Horario de vuelo** (`/schedule`) — cuadrícula semanal editable + lista de
  fechas importantes (exámenes, entregas, lanzamientos).
- **Cuenta regresiva** (`/timer`) — temporizador de enfoque estilo pomodoro con
  presets de 25 / 50 / 5 minutos.
- **Paquete de apoyo** (`/notes`) — notitas de ánimo aleatorias + espacio para
  que ella guarde las suyas.

- **Modo enfoque** (`/focus`) — sesión personalizable (intención + duración) en
  pantalla completa, con el título de la pestaña mostrando la cuenta regresiva
  aunque cambie de ventana, y una guía real (no simulada) para activar el
  "No molestar" de Windows/macOS/celular.

Todo el contenido (tareas, horario, notas, sesiones) se guarda en **Supabase**,
ligado a la cuenta de quien inició sesión. Es decir, funciona igual desde
cualquier dispositivo, con sus datos privados.

⚠️ **Importante sobre notificaciones**: ningún sitio web —este ni ningún
otro— puede silenciar notificaciones del sistema operativo o de otras apps.
Los navegadores no le dan ese permiso a ninguna página, por seguridad. Lo que
sí puede hacer un sitio es ponerse en pantalla completa y guiarte para activar
tú misma el "No molestar" real de tu compu, que es justo lo que hace `/focus`.

## Configurar Supabase (una sola vez)

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En el **SQL Editor** de tu proyecto, pega y corre el contenido de
   `supabase/schema.sql` (crea la tabla y las reglas de seguridad).
3. Ve a **Project Settings → API** y copia la **URL** y la **anon public key**.
4. Copia `.env.example` a `.env` y pega esos dos valores:
   ```bash
   cp .env.example .env
   ```
5. En **Authentication → URL Configuration**, agrega la URL donde vaya a vivir
   el sitio (tu dominio de Vercel) a "Redirect URLs", para que el enlace
   mágico de inicio de sesión funcione ahí también.

Por defecto Supabase manda el correo de "enlace mágico" (sin contraseña) desde
su propio dominio — funciona de inmediato, sin configurar nada de email.

## Correrlo localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:4321`. La primera vez te pedirá tu correo para
mandarte el enlace de acceso.

## Publicarlo en Vercel

**Opción rápida (sin subir a GitHub):**

```bash
npm install -g vercel
vercel
```

Cuando te pregunte por variables de entorno, o después en el dashboard de
Vercel (Settings → Environment Variables), agrega las mismas dos que pusiste
en `.env`:

```
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_ANON_KEY=...
```

Sigue las instrucciones en pantalla (te pedirá iniciar sesión con tu cuenta de
Vercel la primera vez). Cuando termine, te dará una URL pública lista para
compartir — no olvides agregar esa URL a "Redirect URLs" en Supabase (paso 5
de arriba).

**Opción con GitHub (recomendada si quieres seguir editando después):**

1. Crea un repositorio en GitHub y sube esta carpeta.
2. Entra a [vercel.com/new](https://vercel.com/new), importa el repositorio.
3. Agrega las variables de entorno `PUBLIC_SUPABASE_URL` y
   `PUBLIC_SUPABASE_ANON_KEY` en la pantalla de configuración del proyecto.
4. Vercel detecta Astro automáticamente — no necesitas cambiar nada más.
   Dale a "Deploy".

## Personalizarlo

- **Notas de ánimo**: edita el arreglo `MESSAGES` en `src/pages/notes.astro`
  para agregar o cambiar los mensajes.
- **Colores**: todos los tonos están centralizados como variables CSS en
  `src/styles/global.css` (`--flame`, `--telemetry`, `--blush`, etc.).
- **Nombre en el parche**: edítalo directamente en
  `src/components/MissionPatch.astro` (busca el texto "ALEXANDRA · FLIGHT
  ENGINEER").
