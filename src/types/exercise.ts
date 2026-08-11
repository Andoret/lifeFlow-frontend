export type ExerciseCategory = {
  exCatId: number;
  userId: number;
  catname: string;
};

export type ExerciseWeekDay = {
  weekDayId: number;
  userId: number;
  weekStart: string;
  dayOfWeek: number;
  exCatId: number | null;
  reqResponse: string | null;
  timeLimitMinutes: number | null;
  dateUsing: string;
  updatedAt: string;
  exCat?: ExerciseCategory | null;
};
