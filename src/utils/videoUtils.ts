
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
