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
  const [isAnimating, setIsAnimating] = useState(false); //status animacije za transformacijo in fade-in + ikonca
  const [showMatchEmoji, setShowMatchEmoji] = useState(false); //dont even lol

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: "getusers" }),
        });
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
    const fetchSwipedUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: "getswipedusers" }),
        });
        if (response.ok) {
          const data = await response.json();
          setSwipedProfiles(data);
        }
        else {
          //console.error('Error fetching swiped users'); - loh zajebava na first run
        }
      } catch (error) {
        //console.error('Error fetching swiped users', error); - also loh zajebava na first run
      }
    };
    fetchSwipedUsers();
  }, []);

  const handleSwipe = async (direction) => {
    if (isAnimating || currentIndex >= users.length) return;

    const currentProfile = users[currentIndex];
    setSwipedProfiles([...swipedProfiles, { ...currentProfile, direction }]);
    setSwipeDirection(direction);
    setIsAnimating(true);

    const formData = {
      action: "swipe",
      swiped_user: currentProfile.id,
      direction: direction,
    };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      var temp = await response.json()
      if (temp === 'match'){
        console.log("wohoo")
        setShowMatchEmoji(true);
      }

    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred.');
    }

    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsAnimating(false)
      setSwipeDirection(null);
    }, 500);
  };

  const handleGoToHome = () => {
    router.push('/dash');
  };

  const profile = users[currentIndex];
return(
  <div>
    {/* Notification za zaznan match */}
    {showMatchEmoji && (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center bg-black/50"
        style={{ zIndex: 1000 }}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
          <div
            className="text-4xl font-bold text-gray-800 mb-4"
            style={{
              fontSize: '3rem',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            Zaznan match!
          </div>

          <span
            role="img"
            aria-label="match"
            style={{
              fontSize: '12rem',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
              marginBottom: '1rem',
            }}
          >
            🎉
          </span>

          <div
            className="text-4xl font-bold text-gray-800 mb-4"
            style={{
              fontSize: '3rem',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            { users[currentIndex-1].first_name + " " +  users[currentIndex-1].last_name + " (" + users[currentIndex-1].nickname + ")"}
          </div>

          <button
            onClick={() => setShowMatchEmoji(false)}
            className="mt-8 px-6 py-2 text-lg text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Zapri
          </button>
        </div>
      </div>
    )}
    { console.log(profile) }
     <div className="relative">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8">Swipaj profile</h1>
        <div className="flex flex-col items-center mb-8">
          {(() => {
            if (currentIndex < users.length) {
              if (profile) {
                return (
                  <div className="relative">
                    {/* (user) kartica */}
                    <div
                      className={`relative w-full bg-gray-100 rounded-lg p-6 shadow-md transition-all duration-500 ease-in-out ${isAnimating
                        ? swipeDirection === 'left'
                          ? '-translate-x-full opacity-0'
                          : 'translate-x-full opacity-0'
                        : 'opacity-100 translate-x-0'
                        }`}
                    >
                      {/* simbol na kartic */}
                      {swipeDirection && (
                        <div
                          className={`absolute inset-0 flex items-center justify-center ${swipeDirection === 'right' ? 'text-green-500' : 'text-red-500'
                            }`}
                        >
                          <span className="text-8xl font-bold">
                            {swipeDirection === 'right' ? '❤️' : '❌'} {/* please don't break anything lol */}
                          </span>
                        </div>
                      )}
                      {/* info o uporabniku */}
                      <h2 className="text-2xl font-semibold text-center mb-4">
                        {profile.first_name} {profile.last_name} ({profile.nickname}), {profile.age}
                      </h2>
                      <div>
                        <Image
                          src={"/images/" + profile.profile_pic}
                          alt="user nima slike"
                          width={200}
                          height={200}
                          className="mx-auto mb-6"
                        />
                      </div>
                      <p className="text-center text-gray-600 mb-2">{profile.sex}</p>
                      <p className="text-center text-gray-600 mb-2">Preference: {profile.interests}</p>
                      <p className="text-center text-gray-600 mb-2">Game Preference: {profile.game_preferences}</p>
                    </div>
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
                      alt="user nima slike"
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
              className={`px-6 py-2 text-white ${currentIndex >= users.length ? 'bg-gray-400' : 'bg-red-600'
                } rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              Levo
            </button>
            <button
              onClick={() => handleSwipe('right')}
              disabled={currentIndex >= users.length || isAnimating}
              className={`px-6 py-2 text-white ${currentIndex >= users.length ? 'bg-gray-400' : 'bg-green-600'
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
          <div className="space-y-4 h-64 overflow-y-auto scrollbar-hide">
            {swipedProfiles.slice().reverse().map((profile, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p>
                  {profile.nickname} ({profile.first_name} {profile.last_name}) - Swipan {profile.direction === "right" ? "desno" : "levo"} <span className="timestamp">&emsp; {profile.swipe_time_ago ? "pred" : "zdaj"} {profile.swipe_time_ago}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          @keyframes fade-out {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(1.5);
            }
          }

          .animate-fade-out {
            animation: fade-out 5s ease forwards;
          }
        `}</style>
      
      </div>
    </div>
  </div>
  );
};

export default SwipePage;
