import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      await signup(email, password);
      navigate('/tasks'); // Redirect to the task list page
    } catch (error) {
      console.log('Failed to create an account:', error);
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-4">
        <div className="mb-4">
          <label className="block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-64 bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-64 bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-64 bg-gray-700 text-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md self-center"
        >
          Sign Up
        </button>
      </form>
      <div>
        Already have an account? <Link to="/login" className="text-blue-500">Log In</Link>
      </div>
    </div>
  );
}

export default Signup;

