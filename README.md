# Audio Visualizer Showcase

A Next.js application featuring a highly configurable real-time audio visualizer component focused on audio file playback with live customization controls.

## Features

- **Real-time Audio Visualization**: Circular dot pattern with horizontal wave bars that respond to audio playback
- **Audio File Playback**: Support for playing audio files with stunning visualization
- **Live Configuration**: Real-time adjustment of amplitude, wave bars, dot patterns, and colors
- **Dark Theme**: Modern dark circular design with customizable dot patterns
- **Smooth Performance**: Canvas-based rendering with 60fps animation
- **Easy Integration**: Standalone component ready for use in other projects

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser with Web Audio API support

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Audio File Playback
1. Select an audio file from the dropdown menu (includes reference clips)
2. Click "Play Audio" to start playback with visualization
3. Watch the wave bars respond to the audio frequencies across the full width

### Live Configuration
Adjust visualization parameters in real-time:
- **Show Dots**: Toggle the circular dot pattern background
- **Amplitude**: Control wave height (0.5x - 3x, default: 2.0x)
- **Wave Bars**: Adjust frequency resolution (20-100 bars, default: 30)
- **Dot Rings**: Control dot density (4-15 rings, default: 8)

### Color Customization
- **Wave Color**: Customize the audio wave visualization color
- **Dot Color**: Customize the background dot pattern color
- Live color picker with hex input support

## Component Usage

The `AudioVisualizer` component can be integrated into other projects:

```tsx
import { AudioVisualizer } from './components/AudioVisualizer';

function MyComponent() {
  return (
    <div className="h-64 w-64 bg-black rounded-full">
      <AudioVisualizer
        ttsAudioAnalyser={audioAnalyser}
        waveColor="#60a5fa"
        dotColor="#4ade80"
        amplitude={2.0}
        numberOfBars={30}
        dotCount={8}
        showDots={true}
      />
    </div>
  );
}
```

### Props

- `ttsAudioAnalyser` (optional): AnalyserNode for audio playback visualization
- `waveColor` (optional): Hex color for wave visualization (default: "#60a5fa")
- `dotColor` (optional): Hex color for dot pattern (default: "#4ade80")
- `amplitude` (optional): Wave amplitude multiplier (default: 2.0)
- `numberOfBars` (optional): Number of frequency bars (default: 30)
- `dotCount` (optional): Number of dot rings (default: 8)
- `showDots` (optional): Toggle dot pattern visibility (default: true)

## Technical Details

- Built with **Next.js 15** and **TypeScript**
- Styled with **Tailwind CSS**
- Uses **Web Audio API** for real-time audio analysis
- Canvas-based rendering with `requestAnimationFrame` for smooth 60fps visualization
- Real-time parameter updates without performance impact
- Responsive design with proper DPI scaling

## Browser Compatibility

- Chrome 66+
- Firefox 60+
- Safari 11+
- Edge 79+

Note: Web Audio API support required for audio visualization.

## Audio Files

The app includes reference audio clips for demonstration:
- MZ Reference Clip
- Mamaw Reference Clip  
- NF Reference Clip
- Okeyo Reference Clip
- Priya Reference Clip

## License

MIT License - feel free to use this code in your own projects.
