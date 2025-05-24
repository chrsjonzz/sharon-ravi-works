import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import * as Slider from '@radix-ui/react-slider';

interface VideoPlayerProps {
  videoSrc: string;
  videoTitle: string;
  artistName: string;
  posterSrc?: string;
}

const VideoPlayer = ({ videoSrc, videoTitle, artistName, posterSrc }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const previousVolume = useRef(80);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize video player
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
      videoElement.volume = volume / 100;
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    if (videoRef.current) {
      videoRef.current.volume = volumeValue / 100;
    }
    if (volumeValue > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        setVolume(previousVolume.current);
        videoRef.current.volume = previousVolume.current / 100;
        videoRef.current.muted = false;
      } else {
        previousVolume.current = volume;
        setVolume(0);
        videoRef.current.volume = 0;
        videoRef.current.muted = true;
      }
      setIsMuted(!isMuted);
    }
  };

  // Handle seek
  const handleSeek = (newTime: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
    }
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Update fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Show/hide controls on mouse movement
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // Format time in minutes:seconds
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      ref={containerRef}
      className="bg-gradient-to-r from-indigo-950 to-purple-900 rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl mx-auto relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
    >
      <div className="relative">
        <video 
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          className="w-full h-auto"
          onClick={togglePlayPause}
          playsInline
        />
        
        {/* Video overlay for title when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-white text-center">{videoTitle}</h2>
            <p className="text-xl text-purple-300 mt-2">{artistName}</p>
            <motion.button 
              onClick={togglePlayPause}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-6 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaPlay size={32} />
            </motion.button>
          </div>
        )}
        
        {/* Video controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress bar */}
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5 group"
            value={[currentTime]}
            max={duration}
            step={0.01}
            onValueChange={handleSeek}
          >
            <Slider.Track className="bg-purple-800 relative grow rounded-full h-1 group-hover:h-2 transition-all">
              <Slider.Range className="absolute bg-indigo-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb 
              className="hidden group-hover:block w-4 h-4 bg-white rounded-full focus:outline-none focus:shadow-[0_0_0_2px] focus:shadow-indigo-500"
              aria-label="Seek"
            />
          </Slider.Root>
          
          {/* Controls */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-4">
              <button 
                onClick={togglePlayPause}
                className="text-white focus:outline-none"
              >
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>
              
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-white">
                  {isMuted || volume === 0 ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                </button>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-24 h-5"
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                >
                  <Slider.Track className="bg-purple-800 relative grow rounded-full h-1">
                    <Slider.Range className="absolute bg-indigo-500 rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb 
                    className="block w-3 h-3 bg-white rounded-full focus:outline-none focus:shadow-[0_0_0_2px] focus:shadow-indigo-500"
                    aria-label="Volume"
                  />
                </Slider.Root>
              </div>
              
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.a 
                href={videoSrc} 
                download
                className="text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaDownload size={18} />
              </motion.a>
              
              <button 
                onClick={toggleFullscreen}
                className="text-white focus:outline-none"
              >
                {isFullscreen ? <FaCompress size={18} /> : <FaExpand size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
