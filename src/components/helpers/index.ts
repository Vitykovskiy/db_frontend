import { format, parseISO } from "date-fns";

// Метод форматирования даты
export function formatDate(dateString: string): string {
  try {
    const parsedDate = parseISO(dateString);
    return format(parsedDate, "dd.MM.yyyy HH:mm");
  } catch (error) {
    return "Неверная дата";
  }
}
