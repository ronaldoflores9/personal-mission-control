-- Corre esto una sola vez en el SQL Editor de tu proyecto de Supabase.
-- Crea una tabla genérica de almacenamiento (clave/valor) por usuario,
-- protegida con Row Level Security: cada persona solo ve y edita sus propios datos.

create table if not exists app_data (
  user_id uuid references auth.users(id) on delete cascade not null,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table app_data enable row level security;

drop policy if exists "Users manage their own data" on app_data;
create policy "Users manage their own data"
  on app_data
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Claves usadas por la aplicación (se crean solas al usar el sitio):
--   acm.tasks           -> tareas del tablero de misión
--   acm.schedule        -> celdas del horario semanal
--   acm.deadlines       -> fechas importantes
--   acm.ownNotes        -> notitas personales
--   acm.sessions        -> contador de sesiones de enfoque
--   acm.focusSettings   -> configuración personalizada del Modo Enfoque
