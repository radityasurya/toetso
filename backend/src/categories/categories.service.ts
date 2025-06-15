import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Category } from 'shared/types/category';
import { categories as startCategories } from 'shared/mock/categories.mock';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [...startCategories];

  findAll(): Category[] {
    return this.categories;
  }

  findOne(id: string): Category {
    const found = this.categories.find(c => c.id === id);
    if (!found) throw new NotFoundException('Category not found');
    return found;
  }

  create(body: CreateCategoryDto): Category {
    const now = new Date();
    const newCategory: Category = {
      id: uuidv4(),
      ...body,
      createdAt: now,
      updatedAt: now,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  update(id: string, body: UpdateCategoryDto): Category {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) throw new NotFoundException('Category not found');
    this.categories[idx] = {
      ...this.categories[idx],
      ...body,
      updatedAt: new Date(),
    };
    return this.categories[idx];
  }

  remove(id: string): { message: string; deleted: Category } {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) throw new NotFoundException('Category not found');
    const [deleted] = this.categories.splice(idx, 1);
    return { message: 'Deleted', deleted };
  }
}
