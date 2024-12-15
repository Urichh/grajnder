'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SwipePage = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedProfiles, setSwipedProfiles] = useState([]);

  // (za enkrat) hardcoded seznam userjeu
  const profiles = [
    { id: 1, firstName: 'Damjan', lastName: 'Fujs', age: 25, sex: 'Male', preferences: 'Bit legenda, sovražt fiat multiple' },
    { id: 2, firstName: 'janez', lastName: 'Novak', age: 60, sex: 'Male', preferences: 'Rad kuha kavo ob 5ih zjutr' },
    { id: 3, firstName: 'Marija', lastName: 'Novak', age: 7, sex: 'Female', preferences: 'Učenje poštevanke' },
  ];

  const handleSwipe = (direction) => {
    const currentProfile = profiles[currentIndex];
    setSwipedProfiles([...swipedProfiles, { ...currentProfile, direction }]);

    if (currentIndex + 1 < profiles.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
    else{
      setCurrentIndex(profiles.length);
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  // Če zmanjka kartic nared zadnjo default kartico
  const profile = currentIndex < profiles.length ? profiles[currentIndex] : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8">Swipaj profile</h1>

        <div className="flex flex-col items-center mb-8">
          {profile ? (
            <div className="w-full bg-gray-100 rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold text-center mb-4">
                {profile.firstName} {profile.lastName}, {profile.age}
              </h2>
              <p className="text-center text-gray-600 mb-2">{profile.sex}</p>
              <p className="text-center text-gray-600 mb-2">Preference: {profile.preferences}</p>
            </div>
          ) : (
            // Zadnja kartica
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

          {/* gumbi */}
          <div className="mt-6 flex space-x-4">
            {/* sklopi (grey out) gumbe za swiping na zadn kartic */}
            <button
              onClick={() => handleSwipe('left')}
              disabled={currentIndex === profiles.length}
              className={`px-6 py-2 text-white ${currentIndex === profiles.length ? 'bg-gray-400' : 'bg-red-600'} rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              Levo
            </button>
            <button
              onClick={() => handleSwipe('right')}
              disabled={currentIndex === profiles.length}
              className={`px-6 py-2 text-white ${currentIndex === profiles.length ? 'bg-gray-400' : 'bg-green-600'} rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              Desno
            </button>
          </div>
        </div>

        {/* Prikaz zgodovine */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Zgodovina</h2>
          <div className="space-y-4">
            {swipedProfiles.map((profile, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p>
                  {profile.firstName} {profile.lastName} ({profile.age}) - Swipan {profile.direction}
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
