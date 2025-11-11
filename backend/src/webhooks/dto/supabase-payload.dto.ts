// Этот DTO описывает структуру данных, которую присылает вебхук Supabase
// при создании записи в таблице auth.users
export class SupabaseAuthPayloadDto {
  type: 'INSERT';
  table: 'users';
  record: {
    id: string;
    email?: string;
    raw_user_meta_data?: {
      name?: string;
    };
  };
}