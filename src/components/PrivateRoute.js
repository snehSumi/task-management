
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they log in, which is a nicer user experience
    // than dropping them off on the home page.
    navigate('/login', { state: { from: location } });
    return null;
  }

  return children;
}

export default PrivateRoute;
