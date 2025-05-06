import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bookmark, BookmarkState } from '../types';
import { useAuth } from './AuthContext';
import * as supabaseClient from '../utils/supabaseClient';

interface BookmarkContextType extends BookmarkState {
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBookmark: (id: string, bookmark: Partial<Bookmark>) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  setActiveCategory: (categoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<BookmarkState>({
    bookmarks: [],
    categories: [],
    loading: true,
    error: null,
    activeCategory: null,
    searchQuery: '',
  });

  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
  }, [user]);

  const loadBookmarks = async () => {
    try {
      const bookmarks = await supabaseClient.fetchBookmarks(user?.id || '');
      setState(prev => ({ 
        ...prev, 
        bookmarks,
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: (error as Error).message,
        loading: false 
      }));
    }
  };

  const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await supabaseClient.createBookmark(bookmark);
      loadBookmarks();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: (error as Error).message 
      }));
    }
  };

  const updateBookmark = async (id: string, bookmark: Partial<Bookmark>) => {
    try {
      await supabaseClient.updateBookmarkById(id, bookmark);
      loadBookmarks();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: (error as Error).message 
      }));
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      await supabaseClient.deleteBookmarkById(id);
      loadBookmarks();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: (error as Error).message 
      }));
    }
  };

  const setActiveCategory = (categoryId: string | null) => {
    setState(prev => ({ ...prev, activeCategory: categoryId }));
  };

  const setSearchQuery = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  return (
    <BookmarkContext.Provider 
      value={{ 
        ...state, 
        addBookmark, 
        updateBookmark, 
        deleteBookmark,
        setActiveCategory,
        setSearchQuery,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};