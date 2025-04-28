
import React from 'react';
import { useLocalVideos } from '../hooks/useLocalVideos';
import VideoFeed from '../components/VideoFeed';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const { videos, loading, error, deleteVideo, refreshVideos } = useLocalVideos();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={refreshVideos} />;
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
        <h2 className="text-white text-2xl font-semibold mb-4">No Videos Found</h2>
        <p className="text-gray-300 mb-6 text-center">
          No video files were found on your device. Please make sure you have videos on your device and have granted the necessary permissions.
        </p>
        <Button onClick={refreshVideos}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <VideoFeed videos={videos} onDeleteVideo={deleteVideo} />
    </div>
  );
};

export default Index;
