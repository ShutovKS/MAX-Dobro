const monthMap: { [key: string]: number } = {
  'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
  'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
};

/**
 * Parses a Russian date string like "25 июля, 11:00" into a Date object.
 * Assumes the current year, or the next year if the date has already passed.
 */
export const parseRuDateToDate = (dateString: string): Date | null => {
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
};


/**
 * Converts a Russian date string like "25 июля, 11:00" into a "yyyy-MM-ddTHH:mm" string.
 */
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
