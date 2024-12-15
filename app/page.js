'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleGoToUserProfile = () => {
    router.push('/user');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-foreground mb-8">Grajnder - za vse degene</h1>
        <p className="text-lg text-foreground mb-6">nared si profil al neki</p>
        <button
          onClick={handleGoToUserProfile}
          className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Profil
        </button>
      </div>
    </div>
  );
}
