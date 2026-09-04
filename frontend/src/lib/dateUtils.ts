// FILE: frontend/src/lib/dateUtils.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Format and parse event dates and relative timestamps for the mini-app.
//   SCOPE: ISO to Russian display, relative time, Russian date parse, datetime-local
//   DEPENDS: none
//   LINKS: M-FRONTEND-API M-FRONTEND-TYPES
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   formatEventDate - ISO or passthrough event date to "3 июня, 23:49"
//   formatTimestamp - ISO to relative Russian timestamp for feeds and chats
//   parseRuDateToDate - parse "25 июля, 11:00" into a Date
//   parseRuDateToDateTimeLocal - convert a Russian date string to datetime-local
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

const monthMap: { [key: string]: number } = {
  'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
  'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
};

const GENITIVE_MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

const pad2 = (n: number): string => (n < 10 ? '0' : '') + n;

const pluralRu = (n: number, one: string, few: string, many: string): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
};

const isIso = (s: string): boolean => /\d{4}-\d{2}-\d{2}T/.test(s);

/**
 * Форматирует ISO-дату события в "3 июня, 23:49" (тот же формат, что парсит
 * parseRuDateToDate). Если на вход пришла уже готовая строка — возвращает как есть.
 */
// START_CONTRACT: formatEventDate
//   PURPOSE: Format an ISO event date into the Russian display string used by screens
//   INPUTS: { value?: string | null - ISO timestamp or already-formatted date }
//   OUTPUTS: { string - "3 июня, 23:49" or the original non-ISO value }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API fn-parseRuDateToDate
// END_CONTRACT: formatEventDate
export const formatEventDate = (value?: string | null): string => {
  if (!value) return '';
  if (!isIso(value)) return value;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return `${d.getDate()} ${GENITIVE_MONTHS[d.getMonth()]}, ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

/**
 * Человекочитаемое относительное время для лент/комментариев/чатов:
 * "только что", "5 минут назад", "2 часа назад", "вчера", "3 дня назад",
 * иначе — "31 мая" (или "31 мая 2025" для прошлых лет).
 */
// START_CONTRACT: formatTimestamp
//   PURPOSE: Format an ISO timestamp as relative Russian time for feeds and chats
//   INPUTS: { value?: string | null - ISO timestamp or already-formatted string }
//   OUTPUTS: { string - relative or calendar Russian timestamp }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API
// END_CONTRACT: formatTimestamp
export const formatTimestamp = (value?: string | null): string => {
  // START_BLOCK_FORMAT_TIMESTAMP
  if (!value) return '';
  if (!isIso(value)) return value;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;

  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const MIN = 60_000, HOUR = 60 * MIN, DAY = 24 * HOUR;

  if (diff >= 0 && diff < MIN) return 'только что';
  if (diff >= MIN && diff < HOUR) {
    const m = Math.floor(diff / MIN);
    return `${m} ${pluralRu(m, 'минуту', 'минуты', 'минут')} назад`;
  }
  if (diff >= HOUR && diff < DAY) {
    const h = Math.floor(diff / HOUR);
    return `${h} ${pluralRu(h, 'час', 'часа', 'часов')} назад`;
  }
  if (diff >= DAY && diff < 2 * DAY) return 'вчера';
  if (diff >= 2 * DAY && diff < 7 * DAY) {
    const dd = Math.floor(diff / DAY);
    return `${dd} ${pluralRu(dd, 'день', 'дня', 'дней')} назад`;
  }
  const year = d.getFullYear() === now.getFullYear() ? '' : ` ${d.getFullYear()}`;
  return `${d.getDate()} ${GENITIVE_MONTHS[d.getMonth()]}${year}`;
  // END_BLOCK_FORMAT_TIMESTAMP
};

/**
 * Parses a Russian date string like "25 июля, 11:00" into a Date object.
 * Assumes the current year, or the next year if the date has already passed.
 */
// START_CONTRACT: parseRuDateToDate
//   PURPOSE: Parse a Russian event date string into a Date, rolling to next year if past
//   INPUTS: { dateString: string - "25 июля, 11:00" }
//   OUTPUTS: { Date | null - parsed date or null on invalid input }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API fn-parseRuDateToDateTimeLocal
// END_CONTRACT: parseRuDateToDate
export const parseRuDateToDate = (dateString: string): Date | null => {
  // START_BLOCK_PARSE_RU_DATE
  try {
    const parts = dateString.replace(',', '').split(' ');
    if (parts.length < 3) return null;

    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const month = monthMap[monthName];
    const time = parts[2].split(':');
    const hour = parseInt(time[0], 10);
    const minute = parseInt(time[1], 10);

    if (isNaN(day) || month === undefined || isNaN(hour) || isNaN(minute)) return null;

    const now = new Date();
    let year = now.getFullYear();
    const eventDate = new Date(year, month, day, hour, minute);

    if (eventDate < now) {
      eventDate.setFullYear(year + 1);
    }

    return eventDate;
  } catch {
    return null;
  }
  // END_BLOCK_PARSE_RU_DATE
};


/**
 * Converts a Russian date string like "25 июля, 11:00" into a "yyyy-MM-ddTHH:mm" string.
 */
// START_CONTRACT: parseRuDateToDateTimeLocal
//   PURPOSE: Convert a Russian event date string into a datetime-local value
//   INPUTS: { dateString?: string - "25 июля, 11:00" }
//   OUTPUTS: { string - yyyy-MM-ddTHH:mm or empty string }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-API fn-parseRuDateToDate
// END_CONTRACT: parseRuDateToDateTimeLocal
export const parseRuDateToDateTimeLocal = (dateString?: string): string => {
  if (!dateString) return '';

  const date = parseRuDateToDate(dateString);
  if (!date) return '';

  const ten = (i: number) => (i < 10 ? '0' : '') + i;
  const YYYY = date.getFullYear();
  const MM = ten(date.getMonth() + 1);
  const DD = ten(date.getDate());
  const HH = ten(date.getHours());
  const mm = ten(date.getMinutes());

  return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
};
