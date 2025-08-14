'use client';

import { useEffect, useRef, useState } from 'react';

const PCM_BIAS = 128;
const GAP_BETWEEN_BARS = 3;
const SCALE_FACTOR_BARS = 3; // Larger amplitude
const REFRESH_INTERVAL_DURATION = 50;

export function AudioVisualizer({
  ttsAudioAnalyser,
  waveColor = '#60a5fa',
  dotColor = '#4ade80',
  amplitude = 1.5,
  numberOfBars = 50,
  dotCount = 8,
  showDots = true,
}: {
  ttsAudioAnalyser?: AnalyserNode;
  waveColor?: string;
  dotColor?: string;
  amplitude?: number;
  numberOfBars?: number;
  dotCount?: number;
  showDots?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { tts: ttsAudioData } = useAudioAnalyzer(ttsAudioAnalyser);

  useEffect(() => {
    const currentCanvas = canvas.current;
    const context = currentCanvas?.getContext('2d');
    if (!currentCanvas || !context) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const rect = currentCanvas.getBoundingClientRect();
      currentCanvas.width = rect.width * SCALE_FACTOR_BARS;
      currentCanvas.height = rect.height * SCALE_FACTOR_BARS;
      context.scale(SCALE_FACTOR_BARS, SCALE_FACTOR_BARS);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const height = currentCanvas.height / SCALE_FACTOR_BARS; // Actual display size
      const width = currentCanvas.width / SCALE_FACTOR_BARS;
      const centerY = height / 2;
      const centerX = width / 2;

      context.clearRect(0, 0, width, height);

      // Draw circular pattern of dots in background
      if (showDots) {
        const numRings = dotCount;
        const baseDotsPerRing = dotCount;
        const radius = Math.min(width, height) * 0.4;

        for (let ring = 0; ring < numRings; ring++) {
          const ringRadius = (radius / numRings) * (ring + 1);
          const dotsInRing = baseDotsPerRing + ring * 4;
          
          for (let dot = 0; dot < dotsInRing; dot++) {
            const angle = (dot / dotsInRing) * 2 * Math.PI;
            const x = centerX + Math.cos(angle) * ringRadius;
            const y = centerY + Math.sin(angle) * ringRadius;

            // Static colored dots
            const hasAudio = ttsAudioData.length > 0;
            const color = hasAudio ? dotColor : '#2d3748';
            
            context.fillStyle = color;
            context.globalAlpha = hasAudio ? 0.6 : 0.3;
            
            context.beginPath();
            context.arc(x, y, 2, 0, 2 * Math.PI);
            context.fill();
          }
        }
      }

      context.globalAlpha = 1;

      // Render audio bars across full width with configurable amplitude
      if (ttsAudioData.length > 0) {
        const barWidth = width / numberOfBars;

        for (let i = 0; i < numberOfBars; i++) {
          const dataIndex = Math.floor((i / numberOfBars) * ttsAudioData.length);
          const audioDatum = ttsAudioData[dataIndex] ?? PCM_BIAS;
          const adjustedValue = (audioDatum - PCM_BIAS) / PCM_BIAS;
          const barHeight = Math.max(0, Math.abs(adjustedValue) * centerY * amplitude);

          const x = i * barWidth;
          const y = centerY - barHeight / 2;

          context.fillStyle = waveColor;

          if (Math.abs(audioDatum - PCM_BIAS) < 5) {
            drawRoundedBar(context, x, centerY - 5, barWidth - GAP_BETWEEN_BARS, 10, 3);
          } else {
            drawRoundedBar(context, x, y, barWidth - GAP_BETWEEN_BARS, barHeight, 5);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [ttsAudioData, waveColor, dotColor, amplitude, numberOfBars, dotCount, showDots]);

  return <canvas className="size-full" ref={canvas} />;
}


function useAudioAnalyzer(ttsAudioAnalyser?: AnalyserNode) {
  const [audioData, setAudioData] = useState({
    tts: new Uint8Array(0),
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const refreshData = () => {
      let ttsDataArray = new Uint8Array(0);

      if (ttsAudioAnalyser) {
        ttsDataArray = new Uint8Array(ttsAudioAnalyser.frequencyBinCount);
        ttsAudioAnalyser.getByteTimeDomainData(ttsDataArray);
      }

      setAudioData({ tts: ttsDataArray });
    };

    intervalId = setInterval(refreshData, REFRESH_INTERVAL_DURATION);
    refreshData();

    return () => {
      if (intervalId) clearInterval(intervalId);
      setAudioData({ tts: new Uint8Array(0) });
    };
  }, [ttsAudioAnalyser]);
  
  return audioData;
}

function drawRoundedBar(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  // Use local variables to handle changes
  const adjustedWidth = Math.max(0, width);
  const adjustedHeight = Math.max(0, height);
  const adjustedX = Math.max(0, x);
  const adjustedY = Math.max(0, y);

  // Adjust radius to not exceed half of the minimum dimension
  const adjustedRadius = Math.min(radius, Math.min(adjustedWidth, adjustedHeight) / 2);

  context.beginPath();
  context.moveTo(adjustedX + adjustedRadius, adjustedY);
  context.arcTo(
    adjustedX + adjustedWidth,
    adjustedY,
    adjustedX + adjustedWidth,
    adjustedY + adjustedHeight,
    adjustedRadius,
  );
  context.arcTo(
    adjustedX + adjustedWidth,
    adjustedY + adjustedHeight,
    adjustedX,
    adjustedY + adjustedHeight,
    adjustedRadius,
  );
  context.arcTo(adjustedX, adjustedY + adjustedHeight, adjustedX, adjustedY, adjustedRadius);
  context.arcTo(adjustedX, adjustedY, adjustedX + adjustedWidth, adjustedY, adjustedRadius);
  context.closePath();
  context.fill();
}