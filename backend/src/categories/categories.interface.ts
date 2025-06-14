export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  questionCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
