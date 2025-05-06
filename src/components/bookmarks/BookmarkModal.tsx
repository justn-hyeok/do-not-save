import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { Bookmark, Category } from '../../types';
import { useBookmarks } from '../../context/BookmarkContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmark: Bookmark | null;
  categories: Category[];
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndices.modal};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease, visibility 0.2s ease;
`;

const ModalContent = styled.div<{ isOpen: boolean }>`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  transform: ${({ isOpen }) => (isOpen ? 'scale(1)' : 'scale(0.95)')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: transform 0.2s ease, opacity 0.2s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral[500]};
  transition: ${({ theme }) => theme.transitions.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.neutral[700]};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => `${theme.spacing[6]}`};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const SelectContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SelectLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: ${({ theme }) => theme.transitions.normal};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
    outline: none;
  }
`;

const TextAreaLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Checkbox = styled.input`
  margin-right: ${({ theme }) => theme.spacing[2]};
`;

const CheckboxLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  bookmark,
  categories,
}) => {
  const { addBookmark, updateBookmark, loading } = useBookmarks();
  const { user } = useAuth();
  
  const [formState, setFormState] = useState<{
    title: string;
    url: string;
    description: string;
    category: string | null;
    favorite: boolean;
  }>({
    title: '',
    url: '',
    description: '',
    category: categories.length > 0 ? categories[0].id : '',
    favorite: false,
  });
  
  const [errors, setErrors] = useState({
    title: '',
    url: '',
  });
  
  useEffect(() => {
    if (bookmark) {
      setFormState({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description || '',
        category: bookmark.category ?? '',
        favorite: bookmark.favorite,
      });
    } else {
      setFormState({
        title: '',
        url: '',
        description: '',
        category: categories.length > 0 ? categories[0].id : '',
        favorite: false,
      });
    }
    setErrors({ title: '', url: '' });
  }, [bookmark, categories]);
  
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { title: '', url: '' };
    
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    
    if (!formState.url.trim()) {
      newErrors.url = 'URL is required';
      isValid = false;
    } else {
      try {
        // Check if URL is valid
        new URL(formState.url);
      } catch (error) {
        newErrors.url = 'Please enter a valid URL (e.g., https://example.com)';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (bookmark) {
      // Update existing bookmark
      await updateBookmark(bookmark.id, {
        title: formState.title,
        url: formState.url,
        description: formState.description,
        category: (formState.category ?? '') as string,
        favorite: formState.favorite,
      });
    } else {
      // Add new bookmark
      await addBookmark({
        title: formState.title,
        url: formState.url,
        description: formState.description,
        category: (formState.category ?? '') as string,
        favorite: formState.favorite,
        user_id: user?.id || '',
      });
    }
    
    onClose();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormState(prev => ({ ...prev, category: value === '' ? null : value }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
    // Clear error for the field being edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prev => ({ ...prev, [name]: checked }));
  };
  
  // Automatically add https:// if not present
  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let { value } = e.target;
    if (value && !value.match(/^https?:\/\//)) {
      value = `https://${value}`;
      setFormState(prev => ({ ...prev, url: value }));
    }
  };
  
  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent 
        isOpen={isOpen} 
        onClick={e => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle>
            {bookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Input
              label="Title"
              name="title"
              value={formState.title}
              onChange={handleChange}
              placeholder="Enter bookmark title"
              error={errors.title}
              fullWidth
            />
            
            <Input
              label="URL"
              name="url"
              value={formState.url}
              onChange={handleChange}
              onBlur={handleUrlBlur}
              placeholder="https://example.com"
              error={errors.url}
              fullWidth
            />
            
            <SelectContainer>
              <SelectLabel htmlFor="category">Category</SelectLabel>
              <Select 
                id="category" 
                name="category"
                value={formState.category as string}
                onChange={handleChange}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </SelectContainer>
            
            <div>
              <TextAreaLabel htmlFor="description">Description (optional)</TextAreaLabel>
              <TextArea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                placeholder="Add a description..."
              />
            </div>
            
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                id="favorite"
                name="favorite"
                checked={formState.favorite}
                onChange={handleCheckboxChange}
              />
              <CheckboxLabel htmlFor="favorite">Add to favorites</CheckboxLabel>
            </CheckboxContainer>
            
            <ButtonGroup>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                isLoading={loading}
              >
                {bookmark ? 'Update' : 'Save'}
              </Button>
            </ButtonGroup>
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BookmarkModal;