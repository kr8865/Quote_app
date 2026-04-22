import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Quote } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
        } catch (err) {
            setErrorMsg('Failed to register. Be sure fields are valid.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ background: 'var(--primary-accent)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
                        <Quote size={32} color="white" />
                    </div>
                    <h2>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Join Quotify and share wisdom</p>
                </div>

                {errorMsg && (
                    <div style={{ background: 'var(--danger-accent)', color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            minlength="6"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', width: '100%', padding: '14px' }}>
                        Register
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-accent)', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
