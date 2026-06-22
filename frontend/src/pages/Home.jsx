import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import QuoteCard from '../components/QuoteCard';
import Loader from '../components/Loader';
import { Search } from 'lucide-react';

import AuthContext from '../context/AuthContext';

const categories = ['All', 'Inspirational', 'Life', 'Success', 'Love', 'Wisdom', 'Humor', 'Other'];

const Home = () => {
    const { token } = useContext(AuthContext);
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            let query = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/quotes?`;
            if (search) query += `search=${search}&`;
            if (category && category !== 'All') query += `category=${category}`;

            const res = await axios.get(query);
            if (res && res.data) {
                setQuotes(res.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching quotes', err);
        }
        setLoading(false);
    };

    const handleDeleteQuote = (deletedId) => {
        setQuotes(prevQuotes => prevQuotes.filter(q => q._id !== deletedId));
    };

    useEffect(() => {
        if (token) {
            fetchQuotes();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line
    }, [category, token]); // Re-fetch on category change or auth change

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchQuotes();
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '48px', padding: '40px 20px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-lg)' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '16px', background: 'linear-gradient(to right, var(--primary-accent), var(--secondary-accent))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                    Discover Daily Inspiration
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Browse thousands of hand-picked quotes to motivate and uplift your spirit.
                </p>

                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '500px', margin: '32px auto 0' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search quotes or authors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: '48px', borderRadius: '30px' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ borderRadius: '30px' }}>Search</button>
                </form>
            </div>

            {/* Category Filters */}
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '32px', scrollbarWidth: 'none' }}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`btn ${category === cat || (cat === 'All' && category === '') ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Quotes Grid */}
            {loading ? <Loader /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {!token ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                            Please login to access and view all quotes.
                        </div>
                    ) : quotes.length > 0 ? (
                        quotes.map(quote => <QuoteCard key={quote._id} quote={quote} onDelete={handleDeleteQuote} />)
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                            No quotes found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
