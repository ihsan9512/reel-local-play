
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorScreenProps {
  message: string;
  onRetry?: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h2 className="text-white text-2xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-gray-300 mb-6 text-center">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="default">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorScreen;
