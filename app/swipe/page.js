'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SwipePage = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedProfiles, setSwipedProfiles] = useState([]);
  const [users, setUsers] = useState([]); //shranjevanje fetchanih userjev

  //uporaba API rout-a (/app/api/user/route.js) za dostop do baze
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);        
        }
        else {
          console.error('napaka pri branju uporabnikov');
        }
      }
      catch (error) {
        console.error('napaka pri branju uporabnikov', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSwipe = (direction) => {
    const currentProfile = users[currentIndex];
    setSwipedProfiles([...swipedProfiles, { ...currentProfile, direction }]);

    if (currentIndex + 1 < users.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
    else {
      setCurrentIndex(users.length); //da seznam userjev ne gre out of bounds
    }
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  //pokaž zadnjo custom kartico če prideš skoz vse userje
  const profile = currentIndex < users.length ? users[currentIndex] : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8">Swipaj profile</h1>

        <div className="flex flex-col items-center mb-8">
          {profile ? (
            <div className="w-full bg-gray-100 rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold text-center mb-4">
                {profile.first_name} {profile.last_name} ({profile.nickname}), {profile.age}
              </h2>
              <div>
                <Image
                  src={"/images/" + profile.profile_pic}
                  alt="uga buga"
                  width={200}
                  height={200}
                  className="mx-auto mb-6"
                />
              </div>
              <p className="text-center text-gray-600 mb-2">{profile.sex}</p>
              <p className="text-center text-gray-600 mb-2">Preference: {profile.interests}</p>
            </div>
          ) : (
            <div className="w-full bg-gray-100 rounded-lg p-6 shadow-md">
              <p className="text-center text-xl font-semibold text-gray-600">Preswipal si vse profile!</p>
              <div className="mt-6 flex justify-center">
                <Image
                  src="/images/monkey.png"
                  alt="uga buga"
                  width={200}
                  height={200}
                  className="mx-auto mb-6"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => handleSwipe('left')}
              disabled={currentIndex === users.length}
              className={`px-6 py-2 text-white ${currentIndex === users.length ? 'bg-gray-400' : 'bg-red-600'} rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              Levo
            </button>
            <button
              onClick={() => handleSwipe('right')}
              disabled={currentIndex === users.length}
              className={`px-6 py-2 text-white ${currentIndex === users.length ? 'bg-gray-400' : 'bg-green-600'} rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              Desno
            </button>
            <button
              onClick={handleGoToHome}
              className="px-6 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Nazaj na domačo stran
            </button>
          </div>
        </div>

        {/* zgodovina */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Zgodovina</h2>
          <div className="space-y-4">
            {swipedProfiles.map((profile, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p>
                  {profile.first_name} {profile.last_name} ({profile.age}) - Swipan {profile.direction}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipePage;
