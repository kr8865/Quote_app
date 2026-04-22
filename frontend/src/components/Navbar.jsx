import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Quote, User, LogOut, Heart } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            marginBottom: '32px',
            borderBottom: '1px solid var(--border-color)'
        }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <div style={{ background: 'var(--primary-accent)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Quote size={20} color="white" />
                </div>
                Quotify
            </Link>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/create-quote" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                            Create Quote
                        </Link>
                        <Link to="/profile" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                            <User size={18} /> {user.username}
                        </Link>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '10px' }} title="Logout">
                            <LogOut size={18} />
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
