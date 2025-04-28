import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import VideoPlayer from './VideoPlayer';
import { VideoFile } from '../types/video';
import { toast } from '@/components/ui/sonner';

interface VideoFeedProps {
  videos: VideoFile[];
  onDeleteVideo?: (id: string) => Promise<boolean>;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ videos: initialVideos, onDeleteVideo }) => {
  const [videos, setVideos] = useState<VideoFile[]>(initialVideos);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  
  useEffect(() => {
    setVideos(initialVideos);
  }, [initialVideos]);
  
  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };
  
  const handleVideoEnd = () => {
    // Optionally auto advance to next video
    // if (swiperRef.current && activeIndex < videos.length - 1) {
    //   swiperRef.current.slideNext();
    // }
  };
  
  const handleDeleteVideo = async (id: string) => {
    if (onDeleteVideo) {
      const success = await onDeleteVideo(id);
      
      if (success) {
        setVideos((prevVideos) => prevVideos.filter((v) => v.id !== id));
        
        toast("Video deleted successfully", {
          description: "The video has been removed from your device",
        });
        
        if (swiperRef.current) {
          const currentIndex = videos.findIndex(v => v.id === id);
          if (currentIndex === videos.length - 1) {
            swiperRef.current.slidePrev();
          } else {
            swiperRef.current.update();
          }
        }
      } else {
        toast("Failed to delete video", {
          description: "Please try again",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <div className="h-full w-full bg-black">
      {videos.length > 0 ? (
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={handleSlideChange}
          className="h-full w-full"
        >
          {videos.map((video, index) => (
            <SwiperSlide key={video.id} className="h-full w-full">
              <VideoPlayer 
                video={video} 
                isActive={index === activeIndex}
                onVideoEnd={handleVideoEnd}
                onDeleteVideo={handleDeleteVideo}
                currentIndex={activeIndex}
                totalVideos={videos.length}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex items-center justify-center h-full w-full text-white">
          <p>No videos found</p>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
