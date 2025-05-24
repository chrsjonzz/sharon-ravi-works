# Sharon Ravi Works - Project Requirements

## Core Dependencies

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-slider": "^1.1.2",
    "framer-motion": "^10.16.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^4.11.0",
    "wavesurfer.js": "^7.3.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

## System Requirements

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (or pnpm v6.0.0 or higher)
- **Disk Space**: At least 500MB for the project and dependencies
- **Memory**: At least 2GB RAM for development
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux

## Development Environment Setup

### Node.js Installation

1. **Windows/macOS**:
   - Download and install from [nodejs.org](https://nodejs.org/)

2. **Linux (Ubuntu/Debian)**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

### pnpm Installation (Recommended)

```bash
npm install -g pnpm
```

### Project Setup

1. **Clone/Extract the project**:
   - Extract the provided ZIP file to your desired location

2. **Install dependencies**:
   ```bash
   cd sharon_ravi_works
   pnpm install
   ```

3. **Start development server**:
   ```bash
   pnpm dev
   ```

## Browser Compatibility

The website is designed to work with:
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## File Types Support

### Audio
- WAV (44.1kHz, 16-bit stereo recommended)
- MP3 (320kbps recommended)

### Video
- MP4 (H.264 codec)
- WebM

### Images
- JPEG/JPG
- PNG

## Build and Deployment

### Build Command
```bash
pnpm build
```

### Output Directory
The build process creates a `dist` directory containing optimized static files ready for deployment.

### Deployment Requirements
- Any static file hosting service
- No server-side processing required
- HTTPS recommended for optimal audio/video playback

## Development Workflow

1. Make changes to files in the `src` directory
2. Test changes with `pnpm dev`
3. Build for production with `pnpm build`
4. Deploy the contents of the `dist` directory

## Extending the Project

### Adding New Components
1. Create new component files in `src/components/`
2. Import and use them in `App.tsx`

### Styling
- The project uses Tailwind CSS for styling
- Global styles are in `src/index.css`
- Component-specific styles are inline with the Tailwind classes

### State Management
- The project uses React's built-in state management (useState, useEffect)
- For more complex state needs, consider adding Redux or Context API

## Troubleshooting Common Issues

### "Module not found" errors
- Run `pnpm install` to ensure all dependencies are installed

### Audio/Video playback issues
- Check file paths and formats
- Ensure media files are in the correct public directories

### Build errors
- Check for TypeScript errors with `pnpm tsc`
- Ensure all imports are correct

## Recommended Tools

- **VS Code**: Code editor with TypeScript support
- **React Developer Tools**: Browser extension for debugging
- **Tailwind CSS IntelliSense**: VS Code extension for Tailwind
