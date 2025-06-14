import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto, UpdateQuestionDto } from './question.dto';
import { Question } from './questions.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all questions' })
  @ApiResponse({ status: 200, description: 'Array of all questions.' })
  getAll(): Question[] {
    return this.questionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get question by ID' })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'The question.', type: CreateQuestionDto })
  getById(@Param('id') id: string): Question {
    return this.questionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create new question (auth required)' })
  @ApiBody({ type: CreateQuestionDto })
  @ApiResponse({ status: 201, description: 'The created question.', type: CreateQuestionDto })
  create(@Body() body: CreateQuestionDto, @Request() req): Question {
    return this.questionsService.create(body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a question (auth required)' })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiBody({ type: UpdateQuestionDto })
  @ApiResponse({ status: 200, description: 'The updated question.', type: CreateQuestionDto })
  update(@Param('id') id: string, @Body() body: UpdateQuestionDto, @Request() req): Question {
    return this.questionsService.update(id, body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete question (auth required)' })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Deletion success message.' })
  delete(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
