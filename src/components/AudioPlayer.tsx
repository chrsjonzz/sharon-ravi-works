import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaDownload, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import * as Slider from '@radix-ui/react-slider';

interface AudioPlayerProps {
  audioSrc: string;
  trackTitle: string;
  artistName: string;
}

const AudioPlayer = ({ audioSrc, trackTitle, artistName }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const previousVolume = useRef(80);
  
  // Initialize audio element
  useEffect(() => {
    if (audioRef.current) {
      // Set up event listeners
      const audio = audioRef.current;
      
      const handleCanPlayThrough = () => {
        setIsLoading(false);
        setLoadError(false);
        setDuration(audio.duration);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
      };
      
      const handleError = () => {
        console.error('Audio error:', audio.error);
        setLoadError(true);
        setIsLoading(false);
      };
      
      // Add event listeners
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      
      // Set initial volume
      audio.volume = volume / 100;
      
      // Preload audio
      audio.load();
      
      // Cleanup
      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [audioSrc]);
  
  // Handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Create a promise to handle play() which returns a promise
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playback started successfully
            })
            .catch(error => {
              // Auto-play was prevented or other error
              console.error("Error playing audio:", error);
              setLoadError(true);
            });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
    
    if (volumeValue > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  // Handle mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        setVolume(previousVolume.current);
        audioRef.current.volume = previousVolume.current / 100;
      } else {
        previousVolume.current = volume;
        setVolume(0);
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };
  
  // Format time in minutes:seconds
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Generate simple waveform visualization
  const generateWaveform = () => {
    const bars = 30;
    return Array.from({ length: bars }).map((_, index) => {
      const height = Math.random() * 60 + 20; // Random height between 20% and 80%
      const isActive = (index / bars) * 100 <= (currentTime / duration) * 100;
      
      return (
        <div 
          key={index}
          className={`w-1 mx-0.5 rounded-full ${isActive ? 'bg-indigo-500' : 'bg-indigo-800/50'}`}
          style={{ height: `${height}%` }}
        ></div>
      );
    });
  };

  return (
    <motion.div 
      className="glass-morphism rounded-xl p-6 w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white glow-text">{trackTitle}</h2>
            <p className="text-purple-300">{artistName}</p>
          </div>
          <motion.a 
            href={audioSrc} 
            download
            className="btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload /> Download
          </motion.a>
        </div>
        
        {/* Hidden audio element for native browser audio support */}
        <audio 
          ref={audioRef} 
          src={audioSrc} 
          preload="auto"
          className="hidden"
        />
        
        <div className="mt-4 relative">
          {isLoading ? (
            <div className="h-20 w-full flex items-center justify-center">
              <div className="flex items-end justify-center">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="loading-wave mx-1"></div>
                ))}
              </div>
            </div>
          ) : loadError ? (
            <div className="h-20 w-full flex flex-col items-center justify-center">
              <p className="text-red-400 mb-2">Unable to play audio. Please try downloading instead.</p>
              <button 
                onClick={() => {
                  setLoadError(false);
                  setIsLoading(true);
                  if (audioRef.current) {
                    audioRef.current.load();
                  }
                }}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="h-20 w-full flex items-end justify-center space-x-0.5">
              {generateWaveform()}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="text-white">{formatTime(currentTime)}</div>
          <motion.button 
            onClick={togglePlayPause}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full p-4 focus:outline-none shadow-lg hover:shadow-indigo-500/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isLoading || loadError}
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
          </motion.button>
          <div className="text-white">{formatTime(duration)}</div>
        </div>
        
        <div className="flex items-center gap-3 mt-2">
          <button onClick={toggleMute} className="text-white">
            {isMuted || volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </button>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
          >
            <Slider.Track className="bg-purple-800/50 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb 
              className="block w-5 h-5 bg-white rounded-full focus:outline-none focus:shadow-[0_0_0_2px] focus:shadow-indigo-500 shadow-md"
              aria-label="Volume"
            />
          </Slider.Root>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
