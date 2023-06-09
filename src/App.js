import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createRoot } from 'react-dom';
import { FirebaseAppProvider, AuthProvider as FirestoreAuthProvider } from 'reactfire';
import 'firebase/firestore';
import reportWebVitals from './reportWebVitals';
import firebase from './firebase';

const authContext = createContext();

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw new Error('Failed to sign in');
    }
  };

  const signUp = async (email, password) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      throw new Error('Failed to sign up');
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      throw new Error('Failed to sign out');
    }
  };

  const value = {
    currentUser,
    signIn,
    signUp,
    signOut,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

function useAuth() {
  return useContext(authContext);
}

function PrivateRoute({ element, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      element={currentUser ? element : <Navigate to="/login" replace />}
    />
  );
}

function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      // User successfully signed in
    } catch (error) {
      // Handle login error
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

function Signup() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      // User successfully signed up
    } catch (error) {
      // Handle signup error
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

function Dashboard() {
  const { currentUser, signOut } = useAuth();

  return (
    <div>
      <h2>Welcome, {currentUser?.email}!</h2>
      <button onClick={signOut}>Sign Out</button>
      {/* Display user-specific data or perform user-related actions */}
    </div>
  );
}

function TaskList() {
  const { currentUser } = useAuth();

  return (
    <div>
      <h2>Task List for {currentUser?.email}</h2>
      {/* Display user-specific tasks or perform task-related actions */}
    </div>
  );
}

function Root() {
  return (
    <React.StrictMode>
      <Router>
        <FirebaseAppProvider firebaseConfig={firebase.config}>
          <AuthProvider>
            <FirestoreAuthProvider sdk={firebase.firestore}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <PrivateRoute path="/" element={<Dashboard />} />
                <PrivateRoute path="/tasks" element={<TaskList />} />
              </Routes>
            </FirestoreAuthProvider>
          </AuthProvider>
        </FirebaseAppProvider>
      </Router>
    </React.StrictMode>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Root />);

reportWebVitals();
