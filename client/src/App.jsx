import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentHome from './pages/student/StudentHome';
import ClubHome from './pages/club/ClubHome';
import AllClubs from './pages/student/AllClubs';
import MyClubs from './pages/student/MyClubs';
import RegisteredEvents from './pages/student/RegisteredEvents';
import CreateEvent from './pages/club/CreateEvent';
import ManageEvents from './pages/club/ManageEvents';
import Registrations from './pages/club/Registrations';
import Navbar from './components/Navbar';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar />}
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

          {/* Protected routes */}
          {user ? (
            <>
              {/* Student routes */}
              {user.type === 'student' && (
                <>
                  <Route path="/" element={<StudentHome />} />
                  <Route path="/clubs" element={<AllClubs />} />
                  <Route path="/my-clubs" element={<MyClubs />} />
                  <Route path="/registered-events" element={<RegisteredEvents />} />
                </>
              )}

              {/* Club routes */}
              {user.type === 'club' && (
                <>
                  <Route path="/" element={<ClubHome />} />
                  <Route path="/create-event" element={<CreateEvent />} />
                  <Route path="/manage-events" element={<ManageEvents />} />
                  <Route path="/registrations" element={<Registrations />} />
                </>
              )}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
