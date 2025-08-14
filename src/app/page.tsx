'use client';

import { useState, useRef, useEffect } from 'react';
import { AudioVisualizer } from '@/components/AudioVisualizer';

export default function Home() {
  const [ttsAnalyser, setTtsAnalyser] = useState<AnalyserNode | undefined>();
  const [selectedAudio, setSelectedAudio] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Live configuration controls
  const [waveColor, setWaveColor] = useState('#60a5fa');
  const [dotColor, setDotColor] = useState('#4ade80');
  const [amplitude, setAmplitude] = useState(2.0);
  const [numberOfBars, setNumberOfBars] = useState(30);
  const [dotCount, setDotCount] = useState(8);
  const [showDots, setShowDots] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);


  const playAudio = async () => {
    if (!selectedAudio || !audioRef.current) return;
    
    try {
      // Initialize audio context and source only once
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      if (!audioSourceRef.current) {
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 512;
        
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioContextRef.current.destination);
        
        audioSourceRef.current = source;
        audioAnalyserRef.current = analyser;
      }
      
      setTtsAnalyser(audioAnalyserRef.current || undefined);
      setIsPlaying(true);
      
      await audioRef.current.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setTtsAnalyser(undefined);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        setIsPlaying(false);
        setTtsAnalyser(undefined);
      };
      
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const audioFiles = [
    { value: '', label: 'Select an audio file' },
    { value: '/audio/MZ Reference Clip.mp3', label: 'MZ Reference Clip' },
    { value: '/audio/Mamaw Reference Clip.mp3', label: 'Mamaw Reference Clip' },
    { value: '/audio/NF Reference Clip.mp3', label: 'NF Reference Clip' },
    { value: '/audio/Okeyo Reference Clip.mp3', label: 'Okeyo Reference Clip' },
    { value: '/audio/Priya Reference Clip.wav', label: 'Priya Reference Clip' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Audio Visualizer Showcase
        </h1>
        
        {/* Visualizer Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="h-64 w-64 mx-auto bg-black rounded-full overflow-hidden flex items-center justify-center">
            <AudioVisualizer
              ttsAudioAnalyser={ttsAnalyser}
              waveColor={waveColor}
              dotColor={dotColor}
              amplitude={amplitude}
              numberOfBars={numberOfBars}
              dotCount={dotCount}
              showDots={showDots}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audio File Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Audio Playback
            </h2>
            <div className="space-y-4">
              <select
                value={selectedAudio}
                onChange={(e) => setSelectedAudio(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {audioFiles.map((file) => (
                  <option key={file.value} value={file.value}>
                    {file.label}
                  </option>
                ))}
              </select>
              <button
                onClick={isPlaying ? stopAudio : playAudio}
                disabled={!selectedAudio}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  !selectedAudio
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isPlaying
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isPlaying ? 'Stop Audio' : 'Play Audio'}
              </button>
            </div>
          </div>

          {/* Live Configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Live Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Show Dots
                </label>
                <input
                  type="checkbox"
                  checked={showDots}
                  onChange={(e) => setShowDots(e.target.checked)}
                  className="h-4 w-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Amplitude: {amplitude.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={amplitude}
                  onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Wave Bars: {numberOfBars}
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={numberOfBars}
                  onChange={(e) => setNumberOfBars(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Dot Rings: {dotCount}
                </label>
                <input
                  type="range"
                  min="4"
                  max="15"
                  step="1"
                  value={dotCount}
                  onChange={(e) => setDotCount(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Color Customization */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Color Customization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Wave Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={waveColor}
                  onChange={(e) => setWaveColor(e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <input
                  type="text"
                  value={waveColor}
                  onChange={(e) => setWaveColor(e.target.value)}
                  className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Dot Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={dotColor}
                  onChange={(e) => setDotColor(e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <input
                  type="text"
                  value={dotColor}
                  onChange={(e) => setDotColor(e.target.value)}
                  className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} src={selectedAudio || undefined} preload="auto" />
    </div>
  );
}
