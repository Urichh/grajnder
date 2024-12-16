'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SwipePage = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0); //trenutni user card
  const [swipedProfiles, setSwipedProfiles] = useState([]); //shranjuje že swipane profile
  const [users, setUsers] = useState([]); //uporabniki
  const [swipeDirection, setSwipeDirection] = useState(null); //stran swipe-a (left/right)
  const [isAnimating, setIsAnimating] = useState(false); //status animacije za transformacijo in fade-in

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } 
        else {
          console.error('Error fetching users');
        }
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };
    fetchUsers();
  }, []);

  //mostly zarad same animacije
  const handleSwipe = (direction) => {
    if (isAnimating || currentIndex >= users.length) return;

    const currentProfile = users[currentIndex];
    setSwipedProfiles([...swipedProfiles, { ...currentProfile, direction }]);
    setSwipeDirection(direction);
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsAnimating(false);
    }, 500);
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  const profile = users[currentIndex]; //dostopaš do trenutnega profila

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8">Swipaj profile</h1>

        <div className="flex flex-col items-center mb-8">
          {(() => {
            if (currentIndex < users.length) {
              if (profile) {
                return (
                  <div
                    className={`w-full bg-gray-100 rounded-lg p-6 shadow-md transition-all duration-500 ease-in-out ${
                      isAnimating
                        ? swipeDirection === 'left'
                          ? '-translate-x-full opacity-0'
                          : 'translate-x-full opacity-0'
                        : 'opacity-100 translate-x-0'
                    }`}
                  >
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
                );
              }
            }
            else {
              return (
                <div>
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
              );
            }
          })()}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => handleSwipe('left')}
              disabled={currentIndex >= users.length || isAnimating}
              className={`px-6 py-2 text-white ${
                currentIndex >= users.length ? 'bg-gray-400' : 'bg-red-600'
              } rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              Levo
            </button>
            <button
              onClick={() => handleSwipe('right')}
              disabled={currentIndex >= users.length || isAnimating}
              className={`px-6 py-2 text-white ${
                currentIndex >= users.length ? 'bg-gray-400' : 'bg-green-600'
              } rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
