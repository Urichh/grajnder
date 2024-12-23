'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function UserPage() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({action: "getprofile"}),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        
        
      } else {
        console.error('Failed to fetch profile');
      }
    };

    fetchProfile();
    
    
    
  }, []);
  console.log(profile);

  const handleSave = () => {
    alert('Prosim haluciniraj backend, ker ga še ni');
    // Handlaj backend ko tilen postav bazo
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
                id="first-name"
                value={profile ? profile.first_name : ""}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Priimek</label>
              <input
                type="text"
                id="last-name"
                value={profile ? profile.last_name : ""}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Datum rojstva</label>
            <input
              type="date"
              id="age"
              value={profile ? profile.birth_date.slice(0,10) : ""}
              onChange={(e) => setAge(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Spol</label>
            <select
              id="sex"
              value={profile ? profile.sex : ""}
              onChange={(e) => setSex(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Male">Moški</option>
              <option value="Female">Ženski</option>
              <option value="Other">Ostalo</option>
            </select>
          </div>

          <div>
            <label htmlFor="preferences" className="block text-sm font-medium text-gray-700">Preference (ločene z vejicami)</label>
            <textarea
              id="preferences"
              value={profile ? profile.interests : ""}
              onChange={(e) => setPreferences(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className="mt-4 px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Shrani profil
            </button>
          </div>

          {/* gumb za nazaj */}
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
    </div>
  );
}
