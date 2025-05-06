import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { PlusCircle } from 'lucide-react';
import { Bookmark } from '../../types';
import { useBookmarks } from '../../context/BookmarkContext';
import BookmarkCard from './BookmarkCard';
import BookmarkModal from './BookmarkModal';
import { Button } from '../ui/Button';

const ListContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`;

const BookmarksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.neutral[800]};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin: 0;
`;

const BookmarksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const EmptyStateTitle = styled.h3`
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  color: ${({ theme }) => theme.colors.primary[500]};
`;

const BookmarkList: React.FC = () => {
  const { 
    bookmarks, 
    categories, 
    loading, 
    error,
    activeCategory,
    searchQuery,
    updateBookmark,
    deleteBookmark
  } = useBookmarks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const handleAddBookmark = () => {
    setEditingBookmark(null);
    setIsModalOpen(true);
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBookmark(null);
  };

  const handleToggleFavorite = (id: string, favorite: boolean) => {
    updateBookmark(id, { favorite });
  };

  // Filter bookmarks based on active category and search query
  const filteredBookmarks = useMemo(() => {
    let filtered = [...bookmarks];
    
    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter(bookmark => bookmark.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bookmark => 
        bookmark.title.toLowerCase().includes(query) || 
        bookmark.description?.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [bookmarks, activeCategory, searchQuery]);

  if (loading) {
    return <LoadingIndicator>Loading bookmarks...</LoadingIndicator>;
  }

  if (error) {
    return <EmptyState>
      <EmptyStateTitle>Error loading bookmarks</EmptyStateTitle>
      <EmptyStateText>{error}</EmptyStateText>
    </EmptyState>;
  }

  return (
    <ListContainer>
      <BookmarksHeader>
        <Title>
          {activeCategory 
            ? `${categories.find(c => c.id === activeCategory)?.name || ''} Bookmarks` 
            : searchQuery 
              ? `Search results for "${searchQuery}"`
              : 'All Bookmarks'}
        </Title>
        <Button onClick={handleAddBookmark} size="md">
          <PlusCircle size={16} style={{ marginRight: '8px' }} />
          Add Bookmark
        </Button>
      </BookmarksHeader>

      {filteredBookmarks.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No bookmarks found</EmptyStateTitle>
          <EmptyStateText>
            {activeCategory 
              ? "You don't have any bookmarks in this category yet." 
              : searchQuery 
                ? "No bookmarks match your search criteria."
                : "You don't have any bookmarks yet. Add your first one!"}
          </EmptyStateText>
          <Button onClick={handleAddBookmark}>
            <PlusCircle size={16} style={{ marginRight: '8px' }} />
            Add Your First Bookmark
          </Button>
        </EmptyState>
      ) : (
        <BookmarksGrid>
          {filteredBookmarks.map(bookmark => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              categories={categories}
              onEdit={handleEditBookmark}
              onDelete={deleteBookmark}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </BookmarksGrid>
      )}

      <BookmarkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bookmark={editingBookmark}
        categories={categories}
      />
    </ListContainer>
  );
};

export default BookmarkList;