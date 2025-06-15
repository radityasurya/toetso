import { Category } from 'shared/types/category';

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Network error');
  return await res.json() as Category[];
}

export async function fetchCategory(id: string): Promise<Category> {
  const res = await fetch(`${API_URL}/categories/${id}`);
  if (!res.ok) throw new Error('Category not found');
  return await res.json();
}

export async function createCategory(data: Omit<Category, 'id' | 'questionCount'>): Promise<Category> {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return await res.json();
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update category');
  return await res.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete category');
}
