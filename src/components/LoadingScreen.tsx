
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <div className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin mb-4"></div>
      <p className="text-white text-xl">Loading videos...</p>
    </div>
  );
};

export default LoadingScreen;
