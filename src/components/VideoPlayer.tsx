import React, { useRef, useState, useEffect } from 'react';
import { VideoFile } from '../types/video';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Share2, Trash2, Volume, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/sonner';
import { Progress } from '@/components/ui/progress';

interface VideoPlayerProps {
  video: VideoFile;
  isActive: boolean;
  onVideoEnd?: () => void;
  onDeleteVideo?: (id: string) => void;
  currentIndex: number;
  totalVideos: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  video, 
  isActive, 
  onVideoEnd, 
  onDeleteVideo,
  currentIndex,
  totalVideos
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(50);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isActive) {
      try {
        if (isPlaying) {
          const playPromise = videoElement.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Error playing video:', error);
              setIsPlaying(false);
            });
          }
        }
      } catch (err) {
        console.error('Error in video playback:', err);
      }
      
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  useEffect(() => {
    if (isActive && !isPlaying && videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(true);
    }
  }, [isActive]);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoRef]);
  
  const handleVideoEnded = () => {
    if (onVideoEnd) {
      onVideoEnd();
    }
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.error('Error playing video:', e));
      }
      setIsPlaying(!isPlaying);
    }
    
    setShowControls(true);
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  };
  
  const handleTap = () => {
    setShowControls(true);
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      
      if (newVolume === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };
  
  const toggleVolumeControl = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowVolumeControl(!showVolumeControl);
    setShowControls(true);
  };
  
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: video.name,
          text: `Check out this video: ${video.name}`,
          url: video.path,
        });
      } else {
        toast("Sharing not supported on this device", {
          description: "Try copying the link manually",
        });
      }
    } catch (err) {
      console.error('Error sharing video:', err);
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <div className="relative w-full h-full" onClick={handleTap}>
      <video
        ref={videoRef}
        src={video.path}
        className="w-full h-full object-contain bg-black"
        playsInline
        muted={isMuted}
        onClick={togglePlayPause}
        onEnded={handleVideoEnded}
      />
      
      <div className={`absolute bottom-16 left-0 right-0 h-1 bg-gray-700`}>
        <div 
          className="h-full bg-primary"
          style={{ width: `${progressPercentage}%` }} 
        />
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-medium truncate">{video.name}</h3>
            <p className="text-white/80 text-sm truncate">{formatTime(currentTime)} / {formatTime(duration)}</p>
          </div>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleShare}
              className="bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition-colors"
              aria-label="Share video"
            >
              <Share2 size={20} />
            </button>
            
            <div className="relative">
              <button 
                onClick={toggleVolumeControl}
                className="bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition-colors"
                aria-label="Adjust volume"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              
              {showVolumeControl && (
                <div className="absolute top-0 -left-36 bg-black/70 p-3 rounded-lg w-32 h-10 flex items-center">
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
              )}
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              className="bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition-colors"
              aria-label="Delete video"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <Progress value={(currentIndex + 1) / totalVideos * 100} className="h-1" />
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (onDeleteVideo) {
                  onDeleteVideo(video.id);
                }
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VideoPlayer;
