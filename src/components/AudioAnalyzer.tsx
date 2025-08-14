import { AudioVisualizer } from './AudioVisualizer';

// Based on https://github.com/gopigaurav/react-audio-visualizer

export function AudioAnalyzer({
  ttsAudioAnalyser,
}: {
  ttsAudioAnalyser?: AnalyserNode;
}) {
  return (
    <div className="relative size-full overflow-hidden rounded-full p-2">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url('/img/speaker.png')`,
          }}
        />
        <AudioVisualizer ttsAudioAnalyser={ttsAudioAnalyser} />
      </div>
    </div>
  );
}