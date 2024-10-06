import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus, Shield, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Alert Components remain the same
const Alert = ({ children, variant = "default", className, ...props }) => {
  const baseStyles = "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";
  const variantStyles = {
    default: "bg-background text-foreground",
    destructive: "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500 bg-red-500/10",
  };

  return (
    <div
      role="alert"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {variant === "destructive" && <AlertTriangle className="h-4 w-4" />}
      {children}
    </div>
  );
};

const AlertDescription = ({
  className,
  ...props
}) => (
  <div
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
);

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      console.log('Admin Login successful');
      navigate('/admin-dashboard');
    } catch (error) {
      setError('Admin Login failed: ' + error.message);
    }finally{
      setIsLoading(false);
    }
  };

  return (

    <div className="login-container">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="login-content">
        <div className="login-card">
          <div className="logo-container">
            <div className="logo-circle">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back Admin!</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Please enter your details</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <Mail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
              <span>{isLoading ? 'Signing In...' : 'Sign In As Admin'}</span>
            </button>
            
            <div className="additional-links">           
              <Link to="/login" className="secondary-button">
                <LogIn className="w-5 h-5" />
                <span>User Login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>



  );
};

export default AdminLogin;
