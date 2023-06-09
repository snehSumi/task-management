import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { currentUser, login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.log('Failed to log out', error);
    }
  }

  async function handleLogin() {
    try {
      await login(email, password);
      navigate('/tasks');
    } catch (error) {
      console.log('Failed to log in', error);
    }
  }

  function handleSignUp() {
    navigate('/signup');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">Manage your Tasks!</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded-md bg-gray-700 text-white"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 rounded-md bg-gray-700 text-white"
        />
      </div>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
      >
        See Your Tasks
      </button>
      <div className="mt-4">
        <h3 className="text-lg font-bold">New here?</h3>
        <button
          onClick={handleSignUp}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
