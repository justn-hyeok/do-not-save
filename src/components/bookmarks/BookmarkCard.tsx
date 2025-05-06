import React from 'react';
import styled from 'styled-components';
import { Edit2, Trash2, ExternalLink, Star } from 'lucide-react';
import { Bookmark, Category } from '../../types';

interface BookmarkCardProps {
  bookmark: Bookmark;
  categories: Category[];
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, favorite: boolean) => void;
}

const Card = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[4]};
  transition: ${({ theme }) => theme.transitions.normal};
  position: relative;
  overflow: hidden;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
  
  &:hover .bookmark-actions {
    opacity: 1;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const BookmarkTitle = styled.h3`
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.neutral[800]};
  word-break: break-word;
`;

const BookmarkUrl = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  
  svg {
    flex-shrink: 0;
  }
`;

const BookmarkDescription = styled.p`
  margin: ${({ theme }) => theme.spacing[2]} 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  word-break: break-word;
`;

const CategoryBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  background-color: ${({ color }) => color};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const MetaData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const DateTime = styled.span`
  font-style: italic;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.neutral[500]};
    transition: ${({ theme }) => theme.transitions.normal};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[500]};
      
      &.delete {
        color: ${({ theme }) => theme.colors.error[500]};
      }
    }
  }
`;

const FavoriteButton = styled.button<{ isFavorite: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme, isFavorite }) => 
    isFavorite ? theme.colors.primary[400] : theme.colors.neutral[400]};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`;

const TruncateUrl = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  display: inline-block;
`;

const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  categories,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const { id, title, url, description, category, created_at, favorite } = bookmark;
  
  const categoryObject = categories.find(c => c.id === category);
  const formattedDate = new Date(created_at).toLocaleDateString();
  
  // Extract domain from URL
  const domain = url ? new URL(url).hostname.replace('www.', '') : '';
  
  return (
    <Card>
      <CardHeader>
        <div>
          <BookmarkTitle>{title}</BookmarkTitle>
          <BookmarkUrl href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14} />
            <TruncateUrl>{domain}</TruncateUrl>
          </BookmarkUrl>
        </div>
        <FavoriteButton 
          isFavorite={favorite} 
          onClick={() => onToggleFavorite(id, !favorite)}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star size={18} fill={favorite ? "currentColor" : "none"} />
        </FavoriteButton>
      </CardHeader>
      
      {description && <BookmarkDescription>{description}</BookmarkDescription>}
      
      <MetaData>
        {categoryObject && (
          <CategoryBadge color={categoryObject.color}>
            {categoryObject.name}
          </CategoryBadge>
        )}
        <DateTime>Saved on {formattedDate}</DateTime>
      </MetaData>
      
      <ActionButtons className="bookmark-actions">
        <button onClick={() => onEdit(bookmark)} title="Edit">
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => onDelete(id)} 
          className="delete"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </ActionButtons>
    </Card>
  );
};

export default BookmarkCard;