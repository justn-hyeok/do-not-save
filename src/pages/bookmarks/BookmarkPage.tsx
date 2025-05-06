import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '../../components/ui/Button';
import { Bookmark, Category } from '../../types';
import {
  getBookmarks,
  saveBookmarks,
  addBookmark as addBookmarkLS,
  updateBookmark as updateBookmarkLS,
  deleteBookmark as deleteBookmarkLS,
  getCategories,
  addCategory as addCategoryLS,
  updateCategory as updateCategoryLS,
  deleteCategory as deleteCategoryLS,
} from '../../utils/localStorage';

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const Title = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Desc = styled.p`
  margin: 0.5em 0 0 0;
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CategoryBadge = styled.span<{ color: string }>`
  display: inline-block;
  background: ${({ color }) => color};
  color: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: 0.2em 0.7em;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-left: 0.5em;
`;

const Favorite = styled.span`
  color: ${({ theme }) => theme.colors.primary[500]};
  margin-left: 0.5em;
`;

const EmptyMsg = styled.div`
  color: ${({ theme }) => theme.colors.neutral[400]};
  text-align: center;
  margin: 48px 0;
`;

const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.colors.error[600]};
  text-align: center;
  margin: 24px 0;
`;

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
const ModalBox = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  min-width: 340px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;
const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;
const ModalField = styled.div`
  margin-bottom: 16px;
`;
const ModalLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: 4px;
`;
const ModalInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-bottom: 4px;
`;
const ModalTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  resize: vertical;
  min-height: 60px;
`;
const ModalSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
`;
const ModalError = styled.div`
  color: ${({ theme }) => theme.colors.error[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: 8px;
`;

const CategoryList = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;
const CategoryItem = styled.span<{ color: string }>`
  display: flex;
  align-items: center;
  background: ${({ color }) => color};
  color: #fff;
  border-radius: 999px;
  padding: 0.35em 1.1em;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
  gap: 8px;
  transition: transform 0.12s, box-shadow 0.12s;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.13);
    opacity: 0.95;
  }
`;

// 카테고리 수정 모달
const CategoryEditModal = ({ open, onClose, onSave, onDelete, initial, loading }: any) => {
  const [name, setName] = useState(initial?.name || '');
  const [color, setColor] = useState(initial?.color || '#1976d2');
  const [error, setError] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(initial?.name || '');
    setColor(initial?.color || '#1976d2');
    setError('');
    if (open && nameRef.current) {
      setTimeout(() => nameRef.current?.focus(), 100);
    }
  }, [open, initial]);

  const validate = () => {
    if (!name.trim()) return setError('카테고리 이름을 입력하세요.');
    setError('');
    return true;
  };

  if (!open) return null;
  return (
    <ModalOverlay>
      <ModalBox>
        <ModalTitle>카테고리 수정</ModalTitle>
        {error && <ModalError>{error}</ModalError>}
        <ModalField>
          <ModalLabel>이름</ModalLabel>
          <ModalInput ref={nameRef} value={name} onChange={e => setName(e.target.value)} placeholder="카테고리 이름" disabled={loading} />
        </ModalField>
        <ModalField>
          <ModalLabel>색상</ModalLabel>
          <ModalInput type="color" value={color} onChange={e => setColor(e.target.value)} disabled={loading} style={{ width: 40, height: 40, padding: 0, border: 'none', background: 'none' }} />
        </ModalField>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <Button variant="danger" onClick={onDelete} disabled={loading}>삭제</Button>
          <Button variant="secondary" onClick={onClose} disabled={loading}>취소</Button>
          <Button onClick={() => { if (validate()) onSave({ name, color }); }} isLoading={loading}>저장</Button>
        </div>
      </ModalBox>
    </ModalOverlay>
  );
};

// 카테고리 추가 모달
const CategoryModal = ({ open, onClose, onSave, loading }: any) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#1976d2');
  const [error, setError] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName('');
    setColor('#1976d2');
    setError('');
    if (open && nameRef.current) {
      setTimeout(() => nameRef.current?.focus(), 100);
    }
  }, [open]);

  const validate = () => {
    if (!name.trim()) return setError('카테고리 이름을 입력하세요.');
    setError('');
    return true;
  };

  if (!open) return null;
  return (
    <ModalOverlay>
      <ModalBox>
        <ModalTitle>카테고리 추가</ModalTitle>
        {error && <ModalError>{error}</ModalError>}
        <ModalField>
          <ModalLabel>이름</ModalLabel>
          <ModalInput ref={nameRef} value={name} onChange={e => setName(e.target.value)} placeholder="카테고리 이름" disabled={loading} />
        </ModalField>
        <ModalField>
          <ModalLabel>색상</ModalLabel>
          <ModalInput type="color" value={color} onChange={e => setColor(e.target.value)} disabled={loading} style={{ width: 40, height: 40, padding: 0, border: 'none', background: 'none' }} />
        </ModalField>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>취소</Button>
          <Button onClick={() => { if (validate()) onSave({ name, color }); }} isLoading={loading}>추가</Button>
        </div>
      </ModalBox>
    </ModalOverlay>
  );
};

const BookmarkModal = ({ open, onClose, onSave, initial, categories, loading }: any) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [url, setUrl] = useState(initial?.url || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [category, setCategory] = useState(initial?.category || (categories[0]?.id || ''));
  const [favorite, setFavorite] = useState(initial?.favorite || false);
  const [error, setError] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(initial?.title || '');
    setUrl(initial?.url || '');
    setDescription(initial?.description || '');
    setCategory(initial?.category || (categories[0]?.id || ''));
    setFavorite(initial?.favorite || false);
    setError('');
    if (open && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [initial, open, categories]);

  const validate = () => {
    if (!title.trim()) return setError('제목을 입력하세요.');
    if (!url.trim()) return setError('URL을 입력하세요.');
    try { new URL(url); } catch { return setError('올바른 URL 형식이 아닙니다.'); }
    setError('');
    return true;
  };

  if (!open) return null;
  return (
    <ModalOverlay>
      <ModalBox>
        <ModalTitle>{initial ? '북마크 수정' : '북마크 추가'}</ModalTitle>
        {error && <ModalError>{error}</ModalError>}
        <ModalField>
          <ModalLabel>제목</ModalLabel>
          <ModalInput ref={titleRef} value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" disabled={loading} />
        </ModalField>
        <ModalField>
          <ModalLabel>URL</ModalLabel>
          <ModalInput value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" disabled={loading} />
        </ModalField>
        <ModalField>
          <ModalLabel>설명</ModalLabel>
          <ModalTextarea value={description} onChange={e => setDescription(e.target.value)} placeholder="설명 (선택)" disabled={loading} />
        </ModalField>
        <ModalField>
          <ModalLabel>카테고리</ModalLabel>
          {categories.length === 0 ? (
            <div style={{ color: '#888', fontSize: 14 }}>카테고리가 없습니다.</div>
          ) : (
            <ModalSelect value={category} onChange={e => setCategory(e.target.value)} disabled={loading}>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </ModalSelect>
          )}
        </ModalField>
        <ModalField>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={favorite} onChange={e => setFavorite(e.target.checked)} disabled={loading} /> 즐겨찾기
          </label>
        </ModalField>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>취소</Button>
          <Button onClick={() => { if (validate()) onSave({ title, url, description, category, favorite }); }} isLoading={loading}>
            {initial ? '수정' : '추가'}
          </Button>
        </div>
      </ModalBox>
    </ModalOverlay>
  );
};

const BookmarkPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBookmark, setEditBookmark] = useState<Bookmark | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  // 북마크/카테고리 불러오기
  const fetchBookmarks = () => {
    setLoading(true);
    setError(null);
    try {
      setBookmarks(getBookmarks());
    } catch (e) {
      setError('북마크를 불러오는 중 오류가 발생했습니다.');
    }
    setLoading(false);
  };
  const fetchCategories = () => {
    setError(null);
    try {
      setCategories(getCategories());
    } catch (e) {
      setError('카테고리를 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchBookmarks();
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditBookmark(null);
    setModalOpen(true);
  };
  const handleEdit = (bookmark: Bookmark) => {
    setEditBookmark(bookmark);
    setModalOpen(true);
  };
  const handleDelete = (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    setLoading(true);
    setError(null);
    try {
      deleteBookmarkLS(id);
      fetchBookmarks();
    } catch (e) {
      setError('삭제 중 오류가 발생했습니다.');
    }
    setLoading(false);
  };
  const handleSave = (values: { title: string; url: string; description: string; category: string; favorite: boolean }) => {
    setLoading(true);
    setError(null);
    let errorMsg = '';
    try {
      if (editBookmark) {
        updateBookmarkLS({ ...editBookmark, ...values, user_id: '' });
      } else {
        addBookmarkLS({
          id: crypto.randomUUID(),
          ...values,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: '',
        });
      }
      fetchBookmarks();
      setModalOpen(false);
    } catch (e) {
      errorMsg = editBookmark ? '수정 중 오류가 발생했습니다.' : '추가 중 오류가 발생했습니다.';
      setError(errorMsg);
    }
    setLoading(false);
  };
  // 카테고리 추가 핸들러
  const handleAddCategory = (values: { name: string; color: string }) => {
    setLoading(true);
    setError(null);
    try {
      addCategoryLS({
        id: crypto.randomUUID(),
        ...values,
      });
      fetchCategories();
      setCategoryModalOpen(false);
    } catch (e) {
      setError('카테고리 추가 중 오류가 발생했습니다.');
    }
    setLoading(false);
  };

  const handleSaveCategory = (values: { name: string; color: string }) => {
    if (!editCategory) return;
    setLoading(true);
    setError(null);
    try {
      updateCategoryLS({ ...editCategory, ...values });
      fetchCategories();
      setEditCategory(null);
    } catch (e) {
      setError('카테고리 수정 중 오류가 발생했습니다.');
    }
    setLoading(false);
  };
  const handleDeleteCategory = () => {
    if (!editCategory) return;
    if (!window.confirm('카테고리를 삭제하면 해당 카테고리의 북마크는 "카테고리 없음" 상태가 됩니다. 정말 삭제하시겠습니까?')) return;
    setLoading(true);
    setError(null);
    try {
      // 해당 카테고리의 북마크 category를 null로 변경
      const updatedBookmarks = getBookmarks().map(b =>
        b.category === editCategory.id ? { ...b, category: null } : b
      ) as Bookmark[];
      saveBookmarks(updatedBookmarks);
      deleteCategoryLS(editCategory.id);
      fetchCategories();
      fetchBookmarks();
      setEditCategory(null);
    } catch (e) {
      setError('카테고리 삭제 중 오류가 발생했습니다.');
    }
    setLoading(false);
  };

  return (
    <Container>
      <h2>북마크 목록</h2>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <Button onClick={handleAdd} disabled={categories.length === 0 || loading}>
          + 북마크 추가
        </Button>
        <Button variant="primary" style={{ fontWeight: 700, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }} onClick={() => setCategoryModalOpen(true)} disabled={loading}>
          + 카테고리 추가
        </Button>
      </div>
      {/* 카테고리 리스트 */}
      <CategoryList>
        {categories.map(cat => (
          <CategoryItem
            key={cat.id}
            color={cat.color}
            title="카테고리 수정정"
            onClick={() => {
              if (window.confirm(`'${cat.name}' 카테고리를 수정할까요?`)) {
                setEditCategory(cat);
                handleDeleteCategory();
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            {cat.name}
          </CategoryItem>
        ))}
      </CategoryList>
      {categories.length === 0 && <EmptyMsg>카테고리가 없습니다. 먼저 카테고리를 추가하세요.</EmptyMsg>}
      {bookmarks.length === 0 && !loading && <EmptyMsg>아직 등록된 북마크가 없습니다.</EmptyMsg>}
      {loading && <EmptyMsg>로딩 중...</EmptyMsg>}
      <List>
        {bookmarks.map(b => (
          <ListItem key={b.id}>
            <div>
              <Title>{b.title}</Title>
              {b.favorite && <Favorite>★</Favorite>}
              {b.category && (
                <CategoryBadge color={categories.find(c => c.id === b.category)?.color || '#888'}>
                  {categories.find(c => c.id === b.category)?.name || '카테고리'}
                </CategoryBadge>
              )}
              {b.description && <Desc>{b.description}</Desc>}
            </div>
            <Actions>
              <Button size="sm" variant="outline" onClick={() => handleEdit(b)} disabled={loading}>수정</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(b.id)} isLoading={loading} disabled={loading}>삭제</Button>
              <a href={b.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" disabled={loading}>🔗</Button>
              </a>
            </Actions>
          </ListItem>
        ))}
      </List>
      <BookmarkModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editBookmark}
        categories={categories}
        loading={loading}
      />
      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSave={handleAddCategory}
        loading={loading}
      />
      <CategoryEditModal
        open={!!editCategory}
        onClose={() => setEditCategory(null)}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
        initial={editCategory}
        loading={loading}
      />
    </Container>
  );
};

export default BookmarkPage; 