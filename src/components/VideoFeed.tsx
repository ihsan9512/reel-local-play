
import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import VideoPlayer from './VideoPlayer';
import { VideoFile } from '../types/video';

interface VideoFeedProps {
  videos: VideoFile[];
}

const VideoFeed: React.FC<VideoFeedProps> = ({ videos }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  
  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };
  
  const handleVideoEnd = () => {
    // Optionally auto advance to next video
    // if (swiperRef.current && activeIndex < videos.length - 1) {
    //   swiperRef.current.slideNext();
    // }
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
