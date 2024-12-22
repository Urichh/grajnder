'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  const handleConfirmLogin = () => {
    router.push('/login');
  };

  const handleGoToRegPage = () => {
    router.push('/register');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-4x min-w-fit w-1/4 mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8">Vpis</h1>

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
          <form onSubmit={handleConfirmLogin} className='grid'>
                <input type='text' className='pt-2 mx-10 mb-1 focus:outline-none border-b border-indigo-300' placeholder='Uporabniško ime'></input>
                <input type='password' className='pt-4 mx-10 mb-3 focus:outline-none border-b border-indigo-300' placeholder='Geslo'></input>
                <button 
                type='submit'  
                className="py-2 px-16 mt-4 mb-5 max-w-44 mx-auto text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ">
                    Vpis
                </button>
          </form>
          <a
            onClick={handleGoToRegPage}
            className="px-6 py-1 underline text-sm text-indigo-600 hover:text-indigo-700">
            Ustvari račun
          </a>
        </div>
      </div>
    </div>
  );
}
