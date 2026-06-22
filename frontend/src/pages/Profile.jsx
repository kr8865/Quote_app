import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import QuoteCard from '../components/QuoteCard';
import Loader from '../components/Loader';
import { User as UserIcon } from 'lucide-react';

const Profile = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [myQuotes, setMyQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('myQuotes'); // myQuotes or favorites

    useEffect(() => {
        const fetchMyQuotes = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/quotes/myquotes`);
                setMyQuotes(res.data.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };

        if (user) {
            fetchMyQuotes();
        }
    }, [user]);

    const handleDeleteQuote = (deletedId) => {
        setMyQuotes(prev => prev.filter(q => q._id !== deletedId));
        // Need to potentially remove from favorites if also passing onDelete there, but favorites are mapped from user.favorites.
    };

    if (authLoading || loading) return <Loader />;

    if (!user) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Please login to view profile.</div>;

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ background: 'var(--primary-glow)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <UserIcon size={40} color="var(--primary-accent)" />
                </div>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>{user.username}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <button
                    onClick={() => setActiveTab('myQuotes')}
                    style={{
                        background: 'none', border: 'none', color: activeTab === 'myQuotes' ? 'var(--primary-accent)' : 'var(--text-secondary)',
                        fontSize: '1.2rem', fontWeight: '600', cursor: 'pointer', padding: '8px',
                        borderBottom: activeTab === 'myQuotes' ? '2px solid var(--primary-accent)' : '2px solid transparent'
                    }}
                >
                    My Quotes ({myQuotes.length})
                </button>
                <button
                    onClick={() => setActiveTab('favorites')}
                    style={{
                        background: 'none', border: 'none', color: activeTab === 'favorites' ? 'var(--primary-accent)' : 'var(--text-secondary)',
                        fontSize: '1.2rem', fontWeight: '600', cursor: 'pointer', padding: '8px',
                        borderBottom: activeTab === 'favorites' ? '2px solid var(--primary-accent)' : '2px solid transparent'
                    }}
                >
                    Favorites ({user.favorites?.length || 0})
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {activeTab === 'myQuotes' ? (
                    myQuotes.length > 0 ? (
                        myQuotes.map(quote => <QuoteCard key={quote._id} quote={quote} onDelete={handleDeleteQuote} />)
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>You haven't shared any quotes yet.</p>
                    )
                ) : (
                    user.favorites && user.favorites.length > 0 ? (
                        user.favorites.map(quote => <QuoteCard key={quote._id || quote} quote={quote._id ? quote : { _id: quote, content: 'Fetching favorite quote details...', author: '', category: '' }} />)
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>You haven't favorited any quotes yet.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default Profile;
