// FILE: frontend/src/lib/upload.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Upload user images to Supabase Storage or a local object URL in mock mode.
//   SCOPE: VITE_API_MODE switch, user-uploads bucket write, public URL return
//   DEPENDS: M-FRONTEND-AUTH
//   LINKS: M-FRONTEND-API M-FRONTEND-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   uploadImage - store an image and return a preview or public URL
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

const isReal = import.meta.env.VITE_API_MODE === 'real';

const randomName = (): string => {
  const c = (globalThis as any).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
};

// START_CONTRACT: uploadImage
//   PURPOSE: Upload a user image and return a URL for preview or persistence
//   INPUTS: { file: File - image selected by the user }
//   OUTPUTS: { Promise<string> - object URL in mock mode or public storage URL }
//   SIDE_EFFECTS: writes to Supabase bucket user-uploads when VITE_API_MODE is real
//   LINKS: M-FRONTEND-AUTH M-FRONTEND-API
// END_CONTRACT: uploadImage
export async function uploadImage(file: File): Promise<string> {
  // START_BLOCK_UPLOAD_IMAGE
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
  // END_BLOCK_UPLOAD_IMAGE
}
