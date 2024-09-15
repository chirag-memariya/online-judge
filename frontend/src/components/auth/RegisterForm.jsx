import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


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

        if (password != confirmPassword) {
            setError('password do not match!');
            return;
        }
        try {
            await register(firstname,lastname,email,password,dob);
            console.log('Registration successful');
            navigate('/login');
        } catch (error) {
            setError("registration failed: " + error.message);
        }
    }

    return (
<section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6 py-12">
  <div className="flex flex-col items-center justify-center w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800 p-8">
    <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl dark:text-white mb-6">
      User Registration Form
    </h1>
    {error && <div className="text-red-500 mb-4">{error}</div>}
    <form className="w-full space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstname" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Firstname
        </label>
        <input
          type="text"
          name="firstname"
          id="firstname"
          className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Firstname"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="lastname" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Lastname
        </label>
        <input
          type="text"
          name="lastname"
          id="lastname"
          className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Lastname"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Your email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
      </div>

      <div>
        <label htmlFor="dob" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          id="dob"
          className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={dob}
          onChange={(e) => setDOB(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirm-password"
          id="confirm-password"
          placeholder="••••••••"
          className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>

      <div className="flex items-start mt-4">
        <div className="flex items-center h-5">
          <input
            id="terms"
            aria-describedby="terms"
            type="checkbox"
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
            required
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
            I accept the{' '}
            <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">
              Terms and Conditions
            </a>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Register
      </button>

      <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Login here
        </Link>
      </p>
    </form>
  </div>
</section>


    )
}

export default RegisterForm