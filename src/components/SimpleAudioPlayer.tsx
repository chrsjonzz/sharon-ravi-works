import React, { useState, useEffect, useRef, useCallback } from 'react';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaSpinner } from 'react-icons/fa';

// Add Web Audio API types for better TypeScript support
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  thumbnail?: string;
  duration?: number;
}

interface AudioPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
}

const SimpleAudioPlayer: React.FC<AudioPlayerProps> = ({ tracks, currentTrackIndex, onTrackChange }) => {
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isMounted = useRef(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentTrack = tracks[currentTrackIndex];

  const formatTime = useCallback((seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  const initWaveSurfer = useCallback(() => {
    if (!waveformRef.current || !currentTrack?.src) return () => {};

    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#7c3aed',
      progressColor: '#4c1d95',
      cursorColor: '#4c1d95',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 80,
      barGap: 2,
      normalize: true,
      backend: 'WebAudio',
      audioContext: audioContextRef.current,
      mediaControls: false,
      interact: true,
    } as WaveSurferOptions);

    wavesurferRef.current = ws;

    const onReady = () => {
      if (!isMounted.current) return;
      setIsLoading(false);
      // Set initial volume but don't include volume in dependencies
      ws.setVolume(volume / 100);
      ws.setMuted(isMuted);
      setDuration(ws.getDuration());
    };

    const onError = (err: Error) => {
      console.error(err);
      setIsLoading(false);
    };

    const onProcess = () => {
      if (isMounted.current) setCurrentTime(ws.getCurrentTime());
    };

    const onFinish = () => {
      if (isMounted.current) handleNext();
    };

    ws.on('ready', onReady);
    ws.on('error', onError);
    ws.on('audioprocess', onProcess);
    ws.on('finish', onFinish);

    ws.load(currentTrack.src);

    return () => {
      isMounted.current = false;
      ws.un('ready', onReady);
      ws.un('error', onError);
      ws.un('audioprocess', onProcess);
      ws.un('finish', onFinish);
      setTimeout(() => { ws.pause(); ws.destroy(); }, 100);
    };
  }, [currentTrack?.src, isMuted]); // Removed volume from dependencies

  // Handle volume changes separately
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(volume / 100);
      // Unmute if volume is increased from 0
      if (volume > 0 && isMuted) {
        wavesurferRef.current.setMuted(false);
        setIsMuted(false);
      }
    }
  }, [volume, isMuted]);

  useEffect(() => {
    isMounted.current = true;
    setIsLoading(true);
    const cleanup = initWaveSurfer();
    return () => { cleanup(); };
  }, [currentTrack?.src, initWaveSurfer]);

  useEffect(() => { if (wavesurferRef.current) wavesurferRef.current.setVolume(volume / 100); }, [volume]);
  useEffect(() => { if (wavesurferRef.current) wavesurferRef.current.setMuted(isMuted); }, [isMuted]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      wavesurferRef.current?.destroy();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close();
    };
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isLoading || !wavesurferRef.current) return;
    isPlaying ? wavesurferRef.current.pause() : wavesurferRef.current.play();
    setIsPlaying(!isPlaying);
  }, [isPlaying, isLoading]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    if (tracks.length <= 1) return;
    const next = (currentTrackIndex + 1) % tracks.length;
    onTrackChange(next);
  }, [tracks.length, currentTrackIndex, onTrackChange]);

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    if (tracks.length <= 1) return;
    const prev = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    onTrackChange(prev);
  }, [tracks.length, currentTrackIndex, onTrackChange]);
  
  const handleTrackSelect = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onTrackChange(index);
  }, [onTrackChange]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = +e.target.value;
    setVolume(newVolume);
    // Volume changes are handled by the separate effect
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (!wavesurferRef.current) return;
    const m = !isMuted;
    wavesurferRef.current.setMuted(m);
    setIsMuted(m);
  }, [isMuted]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!wavesurferRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    wavesurferRef.current.seekTo(pos);
  }, []);

  const [showTrackList, setShowTrackList] = useState(false);

  if (!currentTrack) return <div className="text-center p-4 text-gray-500">No track selected</div>;

  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">{currentTrack.title}</h3>
          <p className="text-sm text-gray-300">{currentTrack.artist}</p>
        </div>
        <button 
          onClick={() => setShowTrackList(!showTrackList)}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          {showTrackList ? 'Hide Tracks' : `Show Tracks (${tracks.length})`}
        </button>
      </div>

      {showTrackList && (
        <div className="mb-6 bg-gray-800/90 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50">
          <div className="max-h-60 overflow-y-auto">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={(e) => handleTrackSelect(index, e)}
                className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-700 transition-colors ${index === currentTrackIndex ? 'bg-gray-700 text-purple-400' : 'text-gray-200'}`}
              >
                <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center ${index === currentTrackIndex ? 'text-purple-400' : 'text-gray-400'}`}>
                  {index === currentTrackIndex && isPlaying ? (
                    <FaPause className="text-sm" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{track.title}</div>
                  <div className="text-xs text-gray-400 truncate">{track.artist}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {track.duration ? formatTime(track.duration) : '--:--'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="relative w-full h-24 mb-6">
        <div 
          ref={waveformRef} 
          className="w-full h-full bg-gray-800 rounded-lg cursor-pointer" 
          onClick={handleSeek} 
        />
        {!isPlaying && !isLoading && (
          <button 
            onClick={togglePlayPause}
            className="absolute inset-0 m-auto w-14 h-14 bg-purple-600 hover:bg-purple-500 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg"
            aria-label="Play"
          >
            <FaPlay className="ml-1 text-lg" />
          </button>
        )}
        {isLoading && (
          <div className="absolute inset-0 m-auto w-14 h-14 flex items-center justify-center">
            <FaSpinner className="animate-spin text-purple-400 text-xl" />
          </div>
        )}
      </div>
      <div className="flex justify-between text-sm text-gray-400 mb-6 px-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleMute} 
            className="text-gray-300 hover:text-white transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <FaVolumeMute className="text-lg" /> : <FaVolumeUp className="text-lg" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={handleVolumeChange} 
            className="w-24 accent-purple-500 cursor-pointer"
            aria-label="Volume control"
          />
        </div>
        <div className="flex items-center space-x-5">
          <button 
            onClick={handlePrevious} 
            disabled={tracks.length <= 1}
            className="text-gray-300 hover:text-white disabled:opacity-30 transition-colors"
            aria-label="Previous track"
          >
            <FaStepBackward className="text-xl" />
          </button>
          <button 
            onClick={togglePlayPause} 
            disabled={isLoading}
            className="w-12 h-12 flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-all duration-200 disabled:opacity-50 shadow-lg"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin text-lg" />
            ) : isPlaying ? (
              <FaPause className="text-lg" />
            ) : (
              <FaPlay className="ml-1 text-lg" />
            )}
          </button>
          <button 
            onClick={handleNext} 
            disabled={tracks.length <= 1}
            className="text-gray-300 hover:text-white disabled:opacity-30 transition-colors"
            aria-label="Next track"
          >
            <FaStepForward className="text-xl" />
          </button>
        </div>
        <div className="w-24"></div>
      </div>
    </div>
  );
};

export default SimpleAudioPlayer;
