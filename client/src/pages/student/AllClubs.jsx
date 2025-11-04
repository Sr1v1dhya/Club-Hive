import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AllClubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [followedClubs, setFollowedClubs] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // TODO: Replace with actual API calls
      const [clubsRes, followedRes] = await Promise.all([
        fetch('http://localhost:5000/api/student/clubs',  {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }),
        fetch('http://localhost:5000/api/student/clubs/followed', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })
      ]);

      const clubsData = await clubsRes.json();
      const followedData = await followedRes.json();

      setClubs(clubsData);
      setFollowedClubs(new Set(followedData.map(club => club.club_id)));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (clubId) => {
    console.log("CLUB ID", clubId)
    try {
      const response = await fetch(`http://localhost:5000/api/student/clubs/follow`, {
        method: followedClubs.has(clubId) ? 'DELETE' : 'POST',
        body: JSON.stringify({
            club_id: String(clubId),
        }),
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setFollowedClubs(prev => {
          const newSet = new Set(prev);
          if (newSet.has(clubId)) {
            newSet.delete(clubId);
          } else {
            newSet.add(clubId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Clubs</h1>
        <p className="text-gray-600 mt-2">
          Discover and follow clubs that interest you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <ClubCard
            key={club.club_id}
            club={club}
            isFollowed={followedClubs.has(club.club_id)}
            onFollow={() => handleFollow(club.club_id)}
          />
        ))}
      </div>
    </div>
  );
};

const ClubCard = ({ club, isFollowed, onFollow }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {club.club_name}
      </h3>
      <p className="text-gray-600 mb-4">
        {club.description || 'No description available'}
      </p>
      <p className="text-gray-600 mb-4">
        <span className="font-medium">Contact:</span> {club.club_email}
      </p>

      <div className="flex space-x-3">
        <button
          onClick={onFollow}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            isFollowed
              ? 'bg-gray-600 text-white hover:bg-gray-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isFollowed ? 'Unfollow' : 'Follow'}
        </button>

      </div>
    </div>
  );
};

export default AllClubs;