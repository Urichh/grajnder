'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function UserPage() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const [updates, setUpdates] = useState();
  const [gameGenres, setGameGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: "getprofile" }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setGameGenres(data.game_genres || "");
      } else {
        console.error('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = (e) => {
    const { id, value } = e.target;
    const updatedProfile = { ...profile, [id]: value };
    setProfile(updatedProfile);

    setUpdates((prevUpdates) => {
      const filteredUpdates = prevUpdates ? prevUpdates.filter((a) => !a.includes(e.target.id)) : [];

      if (value) {
        filteredUpdates.push(`${e.target.id} = '${value}'`);
      }

      return filteredUpdates;
    });
  };

  const handleSave = async () => {
    console.log(updates.join(", "));

    const formData = {
      action: "setprofile",
      updates: updates,
    };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dash');
      } else {
        const data = await response.json();
        alert(`Error: ${data}`);
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred.');
    }
  };

  const handleAddGenre = () => {
    if (selectedGenre && !gameGenres.includes(selectedGenre)) {
      setGameGenres([...gameGenres, selectedGenre]);
      setUpdates((prev) => [...prev, `game_genres = '${[...gameGenres, selectedGenre].join(", ")}'`]);
      setSelectedGenre("");
    }
  };

  const handleRemoveGenre = () => {
    const updatedGenres = gameGenres.filter((genre) => genre !== selectedGenre);
    setGameGenres(updatedGenres);
    setUpdates((prev) => [...prev, `game_genres = '${updatedGenres.join(", ")}'`]);
    setSelectedGenre("");
  };

  const handleGoToHome = () => {
    router.push('/dash');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8">Tvoj profil</h1>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">Ime</label>
              <input
                type="text"
                id="first_name"
                value={profile ? profile.first_name : ""}
                onChange={(e) => handleUpdate(e)}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Priimek</label>
              <input
                type="text"
                id="last_name"
                value={profile ? profile.last_name : ""}
                onChange={(e) => handleUpdate(e)}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">Datum rojstva</label>
            <input
              type="date"
              id="birth_date"
              value={profile ? profile.birth_date.slice(0, 10) : ""}
              onChange={(e) => handleUpdate(e)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Spol</label>
            <select
              id="sex"
              value={profile ? profile.sex : ""}
              onChange={(e) => handleUpdate(e)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value=""></option>
              <option value="Male">Moški</option>
              <option value="Female">Ženski</option>
              <option value="Other">Ostalo</option>
            </select>
          </div>

          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700">Preference (ločene z vejicami)</label>
            <textarea
              id="interests"
              value={profile ? profile.interests : ""}
              onChange={(e) => handleUpdate(e)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
            ></textarea>
          </div>

          {/* Game Preference Section */}
          <div>
            <label htmlFor="game_preferences" className="block text-sm font-medium text-gray-700">
              Game Preferences (comma-separated)
            </label>
            <textarea
              id="game_preferences"
              value={profile ? profile.game_preferences : ""} // Show the saved genres
              onChange={(e) => handleUpdate(e)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
              readOnly // Make it read-only to prevent manual edits
            ></textarea>
          <div className="flex items-center mt-4 gap-2">
            <select id="game_genre_selector" className="px-4 py-2 border rounded-md">
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="RPG">RPG</option>
              <option value="Shooter">Shooter</option>
              <option value="Strategy">Strategy</option>
            </select>
            <button
              onClick={() => {
                const genre = document.getElementById("game_genre_selector").value;
                const currentPreferences = profile.game_preferences || ""; // Fallback to empty string
                if (!currentPreferences.includes(genre)) {
                  const updatedPreferences = currentPreferences
                    ? `${currentPreferences},${genre}`
                    : genre;
              
                  handleUpdate({
                    target: {
                      id: "game_preferences",
                      value: updatedPreferences,
                    },
                  });
                }
              }}

              className="px-4 py-2 text-white bg-green-500 rounded-md"
            >
              Dodaj
            </button>
            <button
              onClick={() => {
                const genre = document.getElementById("game_genre_selector").value;
                handleUpdate({
                  target: {
                    id: "game_preferences",
                    value: profile.game_preferences
                      .split(",")
                      .filter((g) => g !== genre)
                      .join(","),
                  },
                });
              }}
              className="px-4 py-2 text-white bg-red-500 rounded-md"
            >
              Odstrani
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="mt-4 px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Shrani profil
          </button>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleGoToHome}
            className="px-6 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Nazaj na domačo stran
          </button>
        </div>
      </div>
    </div>
    </div >
  );
}
