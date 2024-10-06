import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, UserPlus, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './RegisterForm.css';

const RegisterForm = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDOB] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {register} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        try {
            await register(firstname, lastname, email, password, dob);
            navigate('/login');
        } catch (error) {
            setError("Registration failed: " + error.message);
        }
    }

    return (
        <div className="register-container">
            <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
            
            <div className="register-content">
                <div className="register-card">
                    <div className="logo-container">
                        <div className="logo-circle">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Join us today!</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="error-alert">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}
                        
                        <div className="name-fields">
                            <div className="form-group">
                                <label htmlFor="firstname">First Name</label>
                                <div className="input-container">
                                    <User className="input-icon" />
                                    <input
                                        type="text"
                                        id="firstname"
                                        placeholder="John"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="lastname">Last Name</label>
                                <div className="input-container">
                                    <User className="input-icon" />
                                    <input
                                        type="text"
                                        id="lastname"
                                        placeholder="Doe"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-container">
                                <Mail className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="dob">Date of Birth</label>
                            <div className="input-container">
                                <Calendar className="input-icon" />
                                <input
                                    type="date"
                                    id="dob"
                                    value={dob}
                                    onChange={(e) => setDOB(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-container">
                                <Lock className="input-icon" />
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <div className="input-container">
                                <Lock className="input-icon" />
                                <input
                                    type="password"
                                    id="confirm-password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                        
                        <div className="terms-checkbox">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                            />
                            <label htmlFor="terms">
                                I accept the{' '}
                                <a href="#" className="terms-link">Terms and Conditions</a>
                            </label>
                        </div>
                        
                        <button type="submit" className="submit-button">
                            <UserPlus className="w-5 h-5" />
                            <span>Create Account</span>
                        </button>
                        
                        <Link to="/login" className="secondary-button">
                            <ChevronLeft className="w-5 h-5" />
                            <span>Back to Login</span>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;