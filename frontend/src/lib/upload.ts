// Загрузка изображений пользователя.
// real-режим — в Supabase Storage (bucket "user-uploads", публичный),
// mock-режим — локальный object URL (превью без бэкенда в дев-режиме).

const isReal = import.meta.env.VITE_API_MODE === 'real';

const randomName = (): string => {
  const c = (globalThis as any).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
};

export async function uploadImage(file: File): Promise<string> {
  if (!isReal) {
    // Дев-режим без Supabase: локальное превью.
    return URL.createObjectURL(file);
  }

  const { supabase } = await import('./supabaseClient');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${randomName()}.${ext}`;

  const { error } = await supabase.storage
    .from('user-uploads')
    .upload(path, file, {
      contentType: file.type || 'image/jpeg',
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Не удалось загрузить изображение: ${error.message}`);
  }

  const { data } = supabase.storage.from('user-uploads').getPublicUrl(path);
  return data.publicUrl;
}
