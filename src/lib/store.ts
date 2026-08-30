import { supabase, isSupabaseConfigured } from './supabase';

const TABLE = 'app_data';

let cachedUserId: string | null | undefined = undefined;

if (isSupabaseConfigured) {
  supabase.auth.getSession().then(({ data }) => {
    cachedUserId = data.session?.user?.id ?? null;
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    cachedUserId = session?.user?.id ?? null;
  });
}

async function currentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  if (cachedUserId !== undefined) return cachedUserId;
  const { data } = await supabase.auth.getSession();
  cachedUserId = data.session?.user?.id ?? null;
  return cachedUserId;
}

export async function getItem<T>(key: string, fallback: T): Promise<T> {
  const userId = await currentUserId();
  if (!userId) return fallback;

  const { data, error } = await supabase
    .from(TABLE)
    .select('value')
    .eq('user_id', userId)
    .eq('key', key)
    .maybeSingle();

  if (error || !data) return fallback;
  return (data.value as T) ?? fallback;
}

export async function setItem(key: string, value: unknown): Promise<void> {
  const userId = await currentUserId();
  if (!userId) {
    console.error('[store] setItem: no userId — data not saved for key:', key);
    return;
  }

  const { error } = await supabase.from(TABLE).upsert(
    {
      user_id: userId,
      key,
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,key' }
  );

  if (error) console.error('[store] setItem error:', error.message, '| key:', key);
}
