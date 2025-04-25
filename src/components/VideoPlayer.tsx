
import React, { useRef, useState, useEffect } from 'react';
import { VideoFile } from '../types/video';
import { VolumeX, Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  video: VideoFile;
  isActive: boolean;
  onVideoEnd?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isActive, onVideoEnd }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Handle play/pause based on visibility
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isActive) {
      try {
        videoElement.currentTime = 0;
        const playPromise = videoElement.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(error => {
              console.error('Error playing video:', error);
              setIsPlaying(false);
            });
        }
      } catch (err) {
        console.error('Error in video playback:', err);
      }
      
      // Hide controls after a few seconds
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  }, [isActive]);
  
  // Handle video ended event
  const handleVideoEnded = () => {
    if (onVideoEnd) {
      onVideoEnd();
    }
    
    // Loop the video
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.error('Error replaying video:', e));
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Show controls on tap
  const handleTap = () => {
    setShowControls(true);
    
    // Hide controls after a few seconds
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  };
  
  return (
    <div className="relative w-full h-full" onClick={handleTap}>
      <video
        ref={videoRef}
        src={video.path}
        className="w-full h-full object-contain bg-black"
        playsInline
        muted={isMuted}
        loop
        onEnded={handleVideoEnded}
      />
      
      {/* Video info overlay */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-white text-lg font-medium truncate">{video.name}</h3>
      </div>
      
      {/* Controls overlay */}
      <div className={`absolute top-4 right-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className="bg-black/40 p-2 rounded-full text-white"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
