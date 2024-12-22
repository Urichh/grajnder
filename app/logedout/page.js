'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  const handleGoToLoginPage = () => {
    router.push('/login');
  };

  const handleGoToRegPage = () => {
    router.push('/register');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8">Grajnder - za vse degene</h1>

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
          <button
            onClick={handleGoToLoginPage}
            className="px-10 py-2 mb-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Vpis
          </button>
          <br />
          <a
            onClick={handleGoToRegPage}
            className="px-6 py-1 underline text-sm text-indigo-600 hover: text-indigo-700">
            Ustvari račun
          </a>
        </div>
      </div>
    </div>
  );
}
