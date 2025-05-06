export interface User {
  id: string;
  email: string;
  created_at?: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string;
  favorite: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface BookmarkState {
  bookmarks: Bookmark[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  activeCategory: string | null;
  searchQuery: string;
}