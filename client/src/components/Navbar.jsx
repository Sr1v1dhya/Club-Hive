import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout, isStudent, isClub } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Club-Hive
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isStudent && (
              <>
                <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Home
                </Link>
                <Link to="/clubs" className="hover:bg-blue-700 px-3 py-2 rounded">
                  All Clubs
                </Link>
                <Link to="/my-clubs" className="hover:bg-blue-700 px-3 py-2 rounded">
                  My Clubs
                </Link>
                <Link to="/registered-events" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Registered Events
                </Link>
              </>
            )}

            {isClub && (
              <>
                <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Home
                </Link>
                <Link to="/create-event" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Create Event
                </Link>
                <Link to="/manage-events" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Manage Events
                </Link>
                <Link to="/registrations" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Registrations
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;