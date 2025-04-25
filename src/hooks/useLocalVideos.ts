
import { useState, useEffect } from 'react';
import { Media } from '@capacitor-community/media';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { VideoFile } from '../types/video';

export const useLocalVideos = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Check if we're running on a mobile device
        const info = await Device.getInfo();
        if (info.platform === 'web' && !Capacitor.isNativePlatform()) {
          // On web, provide sample videos for testing
          setVideos([
            {
              id: '1',
              name: 'Sample Video 1',
              path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            },
            {
              id: '2',
              name: 'Sample Video 2',
              path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            },
            {
              id: '3',
              name: 'Sample Video 3',
              path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
          ]);
          setLoading(false);
          return;
        }
        
        // The Media API has different methods based on the version
        // Let's try to use the correct API based on what's available
        try {
          // Get all videos from the device
          const result = await Media.getMedias({
            types: 'videos', // Changed from ['videos'] to 'videos' to match the expected type
            limit: 100,
          });
          
          if (!result) {
            throw new Error('Failed to get videos');
          }
          
          // Map the videos to our format
          const formattedVideos: VideoFile[] = result.media?.map((video: any, index: number) => ({
            id: video.id || `video-${index}`,
            name: video.name || `Video ${index}`,
            path: video.path,
            duration: video.duration,
            size: video.size,
          })) || [];
          
          setVideos(formattedVideos);
        } catch (apiError) {
          console.error('Specific API error:', apiError);
          throw apiError;
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  return { videos, loading, error };
};
