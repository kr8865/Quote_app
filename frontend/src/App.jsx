import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateQuote from './pages/CreateQuote';
import Profile from './pages/Profile';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app-container">
                    <Navbar />
                    <main style={{ padding: '1rem 0' }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/create-quote" element={<CreateQuote />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
