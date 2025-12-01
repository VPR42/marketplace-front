export const getWeekDayShort = (value: number | string): string => {
  const num = Number(value);
  const titles = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return titles[num - 1] ?? '';
};

export const getWeekDayLong = (value: number | string): string => {
  const num = Number(value);
  const titles = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье',
  ];
  return titles[num - 1] ?? '';
};
