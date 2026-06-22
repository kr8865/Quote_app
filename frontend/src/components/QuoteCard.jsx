import React, { useContext, useState } from 'react';
import { Heart, Edit2, Trash2, X, Check } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const QuoteCard = ({ quote: initialQuote, onToggleFavorite, onDelete }) => {
    const { user } = useContext(AuthContext);
    const [quote, setQuote] = useState(initialQuote);
    const [favoritesCount, setFavoritesCount] = useState(quote.favoritesCount);
    const [isFavorited, setIsFavorited] = useState(user && user.favorites ? user.favorites.some(fav => (typeof fav === 'string' ? fav : fav._id) === quote._id) : false);

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(quote.content);
    const [editCategory, setEditCategory] = useState(quote.category);

    const isOwner = user && (quote.user?._id === user._id || quote.user === user._id);

    const handleFavoriteClick = async () => {
        if (!user) return alert('Please login to like quotes.');

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/quotes/${quote._id}/favorite`);
            setIsFavorited(res.data.data.isFavorited);
            setFavoritesCount(res.data.data.favoritesCount);
            if (onToggleFavorite) onToggleFavorite(quote._id, res.data.data.isFavorited);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this quote?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/quotes/${quote._id}`);
            if (onDelete) onDelete(quote._id);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error deleting quote');
        }
    };

    const handleSaveEdit = async () => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/quotes/${quote._id}`, {
                content: editContent,
                category: editCategory
            });
            setQuote(res.data.data);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error updating quote');
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'var(--transition-fast)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                    background: 'var(--surface-hover)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--secondary-accent)'
                }}>
                    {quote.category}
                </span>
                <button
                    onClick={handleFavoriteClick}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: isFavorited ? 'var(--danger-accent)' : 'var(--text-secondary)',
                        transition: 'var(--transition-fast)'
                    }}
                >
                    <Heart size={20} fill={isFavorited ? 'var(--danger-accent)' : 'none'} />
                    <span style={{ fontWeight: '600' }}>{favoritesCount}</span>
                </button>
            </div>

            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        style={{ marginBottom: '8px', padding: '4px', borderRadius: '4px', background: 'var(--input-bg)', color: 'white', border: '1px solid var(--border-color)' }}
                    />
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        style={{ padding: '8px', borderRadius: '8px', width: '100%', background: 'var(--input-bg)', color: 'white', border: '1px solid var(--border-color)' }}
                    />
                </>
            ) : (
                <p style={{ fontSize: '1.25rem', lineHeight: '1.6', fontWeight: '400', fontStyle: 'italic', color: 'var(--text-primary)' }}>
                    "{quote.content}"
                </p>
            )}

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>— {quote.author}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Shared by {quote.user?.username || 'Unknown'}
                </span>
            </div>

            {isOwner && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                    {isEditing ? (
                        <>
                            <button onClick={handleSaveEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success-color)' }} title="Save">
                                <Check size={18} />
                            </button>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} title="Cancel">
                                <X size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-accent)' }} title="Edit">
                                <Edit2 size={18} />
                            </button>
                            <button onClick={handleDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-accent)' }} title="Delete">
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuoteCard;
