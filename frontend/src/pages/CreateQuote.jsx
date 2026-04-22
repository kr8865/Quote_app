import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const CreateQuote = () => {
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('Inspirational');
    const [errorMsg, setErrorMsg] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const categories = ['Inspirational', 'Life', 'Success', 'Love', 'Wisdom', 'Humor', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setErrorMsg('You must be logged in to create a quote');
            return;
        }

        try {
            await axios.post('http://localhost:5001/api/quotes', {
                content, author, category
            });
            navigate('/');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to create quote');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
            <div className="glass-panel" style={{ padding: '40px' }}>
                <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Share a Quote</h2>

                {errorMsg && (
                    <div style={{ background: 'var(--danger-accent)', color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Quote Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter the quote text..."
                            rows="4"
                            required
                            style={{ resize: 'vertical' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Author</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Who said this?"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '14px', fontSize: '1.1rem', marginTop: '16px' }}>
                        Publish Quote
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateQuote;
