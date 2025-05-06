import { Bookmark, Category, User } from '../types';

// Auth-related storage
export const storeUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};

// Bookmark-related storage
export const getBookmarks = (): Bookmark[] => {
  const bookmarks = localStorage.getItem('bookmarks');
  return bookmarks ? JSON.parse(bookmarks) : [];
};

export const saveBookmarks = (bookmarks: Bookmark[]): void => {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};

export const addBookmark = (bookmark: Bookmark): void => {
  const bookmarks = getBookmarks();
  saveBookmarks([...bookmarks, bookmark]);
};

export const updateBookmark = (updatedBookmark: Bookmark): void => {
  const bookmarks = getBookmarks();
  const updatedBookmarks = bookmarks.map((bookmark) => 
    bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
  );
  saveBookmarks(updatedBookmarks);
};

export const deleteBookmark = (id: string): void => {
  const bookmarks = getBookmarks();
  saveBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
};

// Category-related storage
export const getCategories = (): Category[] => {
  const categories = localStorage.getItem('categories');
  if (categories) {
    return JSON.parse(categories);
  }
  // 기본 카테고리 없이 빈 배열 반환
  localStorage.setItem('categories', JSON.stringify([]));
  return [];
};

export const saveCategories = (categories: Category[]): void => {
  localStorage.setItem('categories', JSON.stringify(categories));
};

export const addCategory = (category: Category): void => {
  const categories = getCategories();
  saveCategories([...categories, category]);
};

export const updateCategory = (updatedCategory: Category): void => {
  const categories = getCategories();
  const updatedCategories = categories.map((category) => 
    category.id === updatedCategory.id ? updatedCategory : category
  );
  saveCategories(updatedCategories);
};

export const deleteCategory = (id: string): void => {
  const categories = getCategories();
  saveCategories(categories.filter((category) => category.id !== id));
};