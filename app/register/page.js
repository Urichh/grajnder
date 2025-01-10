'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [usernameError, setUsernameError] = useState(''); // State to store username error


  const handleRegister = async (event) => {
    event.preventDefault();

    const formData = {
      action: "register",
      username: event.target[0].value,
      email: event.target[1].value,
      password: event.target[2].value,
      firstName: event.target[3].value,
      lastName: event.target[4].value,
      age: event.target[5].value,
      sex: event.target.gender.value,
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
        //alert('User registered successfully!'); se mi zdi mal pointless tbh
        router.push('/login');
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-4x min-w-fit w-1/4 mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8">Nov uporabnik</h1>

        <div className="mb-8">
          <Image
            src="/images/monkey.png"
            alt="opica"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>

        <div className="space-y-4 text-center">
          <form onSubmit={handleRegister} className="grid">
            <h2>Vnesite podatke za prijavo</h2>
            <input
              type="text"
              className="pt-2 mx-10 mb-1 focus:outline-none border-b border-indigo-300"
              placeholder="Uporabniško ime"
            />
            <input
              type="email"
              className="pt-4 mx-10 mb-1 focus:outline-none border-b border-indigo-300"
              placeholder="Email"
            />
            <input
              type="password"
              className="pt-4 mx-10 mb-8 focus:outline-none border-b border-indigo-300"
              placeholder="Geslo"
            />

            <h2>Vnesite svoje osebne podatke</h2>
            <input
              type="text"
              className="pt-4 mx-10 mb-1 focus:outline-none border-b border-indigo-300"
              placeholder="Ime"
            />
            <input
              type="text"
              className="pt-4 mx-10 mb-1 focus:outline-none border-b border-indigo-300"
              placeholder="Priimek"
            />
            <input
              type="date"
              min="1900-01-01"
              className="pt-4 mx-10 mb-1 focus:outline-none border-b border-indigo-300"
              placeholder="Datum rojstva"
            />
            <div className="flex items-center mx-10 mb-3">
              <h2 className="pr-4">Spol:</h2>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    className="form-radio text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Moški</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    className="form-radio text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Ženska</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value=""
                    className="form-radio text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Ostalo</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="py-2 px-10 mt-4 mb-5 max-w-44 mx-auto text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Ustvari račun
            </button>
          </form>
          <a
            onClick={() => router.push('/login')}
            className="px-6 py-1 underline text-sm text-indigo-600 hover:text-indigo-700"
          >
            Vpiši se
          </a>
        </div>
      </div>
    </div>
  );
}
