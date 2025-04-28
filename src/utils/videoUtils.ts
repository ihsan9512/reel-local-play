
import { Media } from '@capacitor-community/media';
import { VideoFile } from '../types/video';
import { sampleVideos } from '../data/sampleVideos';
import { isNativePlatform } from './platformUtils';

export const fetchDeviceVideos = async (): Promise<VideoFile[]> => {
  const result = await Media.getMedias({
    types: 'videos',
  });
  
  if (!result || !result.medias) {
    throw new Error('Failed to get videos');
  }
  
  return result.medias.map((video: any, index: number) => ({
    id: video.id || `video-${index}`,
    name: video.name || `Video ${index}`,
    path: video.path,
    duration: video.duration,
    size: video.size,
  }));
};

export const getVideos = async (): Promise<VideoFile[]> => {
  const isNative = await isNativePlatform();
  if (!isNative) {
    return sampleVideos;
  }
  return fetchDeviceVideos();
};

export const deleteVideo = async (videoId: string): Promise<void> => {
  const isNative = await isNativePlatform();
  
  if (!isNative) {
    // In web mode, we're using sample videos which can't actually be deleted,
    // so we'll just simulate success
    console.log('Simulating deletion of video:', videoId);
    return Promise.resolve();
  }
  
  try {
    // For native platforms, use the Media API to delete the video
    // The Media plugin doesn't have deleteMedia, so we need to use the correct method
    await Media.deleteMedia({
      id: videoId
    });
    return Promise.resolve();
  } catch (error) {
    console.error('Error deleting video:', error);
    throw new Error('Failed to delete video');
  }
};
