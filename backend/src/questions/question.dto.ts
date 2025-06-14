import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ example: "What is 2+2?", description: "The text of the question" })
  @IsString() @IsNotEmpty()
  question: string;

  @ApiProperty({ example: ["3", "4", "5", "6"], description: "Possible answers" })
  @IsArray()
  options: string[];

  @ApiProperty({ example: 1, description: "Index of correct answer (0-based)" })
  @IsInt()
  correctAnswer: number;

  @ApiProperty({ example: "A simple addition question", required: false })
  @IsString() @IsOptional()
  explanation?: string;

  @ApiProperty({ example: "Math", description: "The category name" })
  @IsString()
  category: string;

  @ApiProperty({ example: "easy", description: "Question difficulty", required: false })
  @IsString() @IsOptional()
  difficulty?: string;

  @ApiProperty({ example: "1", description: "Creator user id, auto-set by API", required: false })
  @IsString() @IsOptional()
  createdBy?: string;

  @ApiProperty({ example: "1", description: "Updater user id, auto-set by API", required: false })
  @IsString() @IsOptional()
  updatedBy?: string;
}

export class UpdateQuestionDto {
  @ApiProperty({ example: "What is 2+2?", required: false })
  @IsString() @IsOptional()
  question?: string;

  @ApiProperty({ example: ["3", "4", "5", "6"], required: false })
  @IsArray() @IsOptional()
  options?: string[];

  @ApiProperty({ example: 1, required: false })
  @IsInt() @IsOptional()
  correctAnswer?: number;

  @ApiProperty({ example: "A simple addition question", required: false })
  @IsString() @IsOptional()
  explanation?: string;

  @ApiProperty({ example: "Math", required: false })
  @IsString() @IsOptional()
  category?: string;

  @ApiProperty({ example: "easy", required: false })
  @IsString() @IsOptional()
  difficulty?: string;

  @ApiProperty({ example: "1", required: false })
  @IsString() @IsOptional()
  updatedBy?: string;
}
