import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './categories.interface';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAll(): Category[] {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Category {
    return this.categoriesService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateCategoryDto): Category {
    return this.categoriesService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateCategoryDto): Category {
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
