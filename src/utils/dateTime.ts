export interface DayItem {
  dateString: string; // YYYY-MM-DD
  dayName: string; // T2, T3, T4, T5, T6, T7, CN
  dayNumber: string; // 24
  month: string; // Thg 9
  isToday: boolean;
  fullDisplay: string; // Thứ Tư, 24/09
}

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const FULL_DAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export const getNext7Days = (): DayItem[] => {
  const days: DayItem[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    days.push({
      dateString,
      dayName: DAY_NAMES[d.getDay()],
      dayNumber: day,
      month: `Th${d.getMonth() + 1}`,
      isToday: i === 0,
      fullDisplay: `${FULL_DAY_NAMES[d.getDay()]}, ${day}/${month}`,
    });
  }

  return days;
};

export const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  const dayOfWeek = FULL_DAY_NAMES[d.getDay()] || '';
  return `${dayOfWeek}, ${day}/${month}/${year}`;
};

export const parseSlotToDate = (dateString: string, timeString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};

export const isTimeInSlot = (currentTime: Date, dateString: string, startTime: string, endTime: string): boolean => {
  const start = parseSlotToDate(dateString, startTime);
  const end = parseSlotToDate(dateString, endTime);
  return currentTime >= start && currentTime < end;
};
