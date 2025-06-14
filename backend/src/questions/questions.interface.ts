export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  difficulty?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy: string; // user id
  updatedBy: string; // user id
}
