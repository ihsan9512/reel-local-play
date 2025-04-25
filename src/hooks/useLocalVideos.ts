
import { useState, useEffect } from 'react';
import { VideoFile } from '../types/video';
import { getVideos } from '../utils/videoUtils';

export const useLocalVideos = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videoFiles = await getVideos();
        setVideos(videoFiles);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    };
    
    loadVideos();
  }, []);
  
  return { videos, loading, error };
};
