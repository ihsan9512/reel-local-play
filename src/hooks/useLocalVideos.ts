
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
        
        // Request permissions if on a mobile device
        const { granted } = await Media.requestPermissions({
          permissions: ['read'],
        });
        
        if (!granted) {
          throw new Error('Storage permission not granted');
        }
        
        // Get all videos from the device
        const { videos: videoFiles } = await Media.getMedias({
          options: {
            types: ['videos'],
            limit: 100,  // Adjust as needed
          },
        });
        
        // Map the videos to our format
        const formattedVideos: VideoFile[] = videoFiles.map((video: any, index) => ({
          id: video.id || `video-${index}`,
          name: video.name || `Video ${index}`,
          path: video.path,
          duration: video.duration,
          size: video.size,
        }));
        
        setVideos(formattedVideos);
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
