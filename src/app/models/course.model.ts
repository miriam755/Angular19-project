export interface Course {
id: number;
  title: string;
  description: string;
  teacherId: number;
  isEnrolled?: boolean; // מציין אם המשתמש רשום לקורס (אופציונלי, תלוי ב-API)
}