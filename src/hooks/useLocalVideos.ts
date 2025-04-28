
import { useState, useEffect } from 'react';
import { VideoFile } from '../types/video';
import { getVideos, deleteVideo } from '../utils/videoUtils';
import { toast } from '@/components/ui/sonner';

export const useLocalVideos = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadVideos = async () => {
    setLoading(true);
    try {
      const videoFiles = await getVideos();
      setVideos(videoFiles);
      setError(null);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadVideos();
  }, []);
  
  const handleDeleteVideo = async (videoId: string): Promise<boolean> => {
    try {
      await deleteVideo(videoId);
      return true;
    } catch (err) {
      console.error('Error deleting video:', err);
      toast("Error deleting video", {
        description: err instanceof Error ? err.message : 'Failed to delete video',
      });
      return false;
    }
  };
  
  const refreshVideos = () => {
    loadVideos();
  };
  
  return { 
    videos, 
    loading, 
    error, 
    deleteVideo: handleDeleteVideo,
    refreshVideos 
  };
};
