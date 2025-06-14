import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Question } from './questions.interface';
import { questions as startQuestions } from './questions.mock';
import { CreateQuestionDto, UpdateQuestionDto } from './question.dto';

@Injectable()
export class QuestionsService {
  private questions: Question[] = [...startQuestions];

  findAll(): Question[] {
    return this.questions;
  }

  findOne(id: string): Question {
    const found = this.questions.find(q => q.id === id);
    if (!found) throw new NotFoundException('Question not found');
    return found;
  }

  create(body: CreateQuestionDto, userId: string): Question {
    const now = new Date();
    const newQuestion: Question = {
      id: uuidv4(),
      ...body,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
    };
    this.questions.push(newQuestion);
    return newQuestion;
  }

  update(id: string, body: UpdateQuestionDto, userId: string): Question {
    const idx = this.questions.findIndex(q => q.id === id);
    if (idx === -1) throw new NotFoundException('Question not found');
    this.questions[idx] = {
      ...this.questions[idx],
      ...body,
      updatedBy: userId,
      updatedAt: new Date(),
    };
    return this.questions[idx];
  }

  remove(id: string): { message: string; deleted: Question } {
    const idx = this.questions.findIndex(q => q.id === id);
    if (idx === -1) throw new NotFoundException('Question not found');
    const [deleted] = this.questions.splice(idx, 1);
    return { message: 'Deleted', deleted };
  }
}
