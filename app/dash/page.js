'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  const handleGoToUserPage = () => {
    router.push('/user');
  };

  const handleGoToSwipePage = () => {
    router.push('/swipe');
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
            onClick={handleGoToUserPage}
            className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Profil
          </button>
          <br />
          <button
            onClick={handleGoToSwipePage}
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Swipaj
          </button>
        </div>
      </div>
    </div>
  );
}

