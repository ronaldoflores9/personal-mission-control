import { supabase, isSupabaseConfigured } from './supabase';

const TABLE = 'app_data';

async function currentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
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
  if (!userId) return;

  await supabase.from(TABLE).upsert(
    {
      user_id: userId,
      key,
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,key' }
  );
}
