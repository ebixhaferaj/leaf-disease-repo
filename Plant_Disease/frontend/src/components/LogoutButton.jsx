import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import instance from '../api/axios'; // your axios instance

const LogoutButton = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend to revoke token
      await instance.post('/auth/logout', {
        access_token: auth.accessToken
      }, {
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      });
    } catch (error) {
      console.error('Logout API failed:', error);
      // You might want to still logout client-side even if backend call fails
    }

    // Clear auth state & local storage
    setAuth({});
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('user_id');

    // Redirect to login
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
