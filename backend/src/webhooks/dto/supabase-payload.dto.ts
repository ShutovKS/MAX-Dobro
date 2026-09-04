// FILE: backend/src/webhooks/dto/supabase-payload.dto.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Reference DTO for the Supabase auth.users INSERT webhook payload.
//   SCOPE: type, table, and record id/email/name fields
//   DEPENDS: none
//   LINKS: M-WEBHOOKS, V-M-WEBHOOKS
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   SupabaseAuthPayloadDto - INSERT users webhook record shape
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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
