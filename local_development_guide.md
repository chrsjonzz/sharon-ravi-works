# Sharon Ravi Works - Local Development Guide

## Overview
This guide provides comprehensive instructions for setting up and continuing development of the "Sharon Ravi Works" music portfolio website on your local environment. This will allow you to add new songs, videos, images, and features without starting from scratch.

## Project Structure

The website is built using React with TypeScript and uses the following structure:

```
music-portfolio/
├── node_modules/         # Dependencies (generated)
├── public/               # Static files
│   ├── assets/           # Audio files
│   └── images/           # Image files
├── src/                  # Source code
│   ├── components/       # React components
│   │   ├── AudioPlayer.tsx
│   │   ├── Gallery.tsx
│   │   ├── UploadHandler.tsx
│   │   └── VideoPlayer.tsx
│   ├── App.tsx           # Main application component
│   ├── index.css         # Global styles
│   └── main.tsx          # Entry point
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Prerequisites

To work on this project locally, you'll need:

1. **Node.js** (v16 or newer)
2. **npm** or **pnpm** package manager
3. A code editor (VS Code recommended)
4. Basic knowledge of React and TypeScript

## Setup Instructions

### 1. Install Node.js and npm

Download and install Node.js from [nodejs.org](https://nodejs.org/). This will also install npm.

### 2. Install pnpm (optional but recommended)

```bash
npm install -g pnpm
```

### 3. Extract the Project Files

Extract the provided ZIP file to your desired location.

### 4. Install Dependencies

Navigate to the project directory in your terminal:

```bash
cd path/to/music-portfolio
```

Install dependencies:

```bash
pnpm install
# or if using npm
npm install
```

### 5. Start the Development Server

```bash
pnpm dev
# or if using npm
npm run dev
```

This will start the development server, typically at http://localhost:5173/

## Adding New Content

### Adding Audio Tracks

1. Place your audio files (WAV, MP3) in the `public/assets/` directory
2. Update the `mediaItems` array in `src/App.tsx` to include your new tracks:

```typescript
const [mediaItems, setMediaItems] = useState<MediaItem[]>([
  {
    id: '4', // Use a unique ID
    title: 'Your New Track Title',
    type: 'audio',
    src: '/assets/your-new-track.wav', // Path relative to public directory
    thumbnail: '/images/your-thumbnail.jpg',
    artist: 'Sharon Ravi',
    description: 'Description of your new track'
  },
  // Existing items...
]);
```

### Adding Videos

1. Place your video files (MP4, WebM) in the `public/assets/` directory
2. Add a thumbnail image in `public/images/`
3. Update the `mediaItems` array in `src/App.tsx` similar to audio tracks, but with `type: 'video'`

### Adding Images

1. Place your image files (JPG, PNG) in the `public/images/` directory
2. Update the `mediaItems` array in `src/App.tsx` similar to audio tracks, but with `type: 'image'`

## Building for Production

When you're ready to deploy your updated website:

```bash
pnpm build
# or if using npm
npm run build
```

This creates a `dist` directory with optimized files ready for deployment.

## Deployment Options

### Option 1: Static Hosting Services

Upload the contents of the `dist` directory to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- Amazon S3
- Firebase Hosting

### Option 2: Traditional Web Hosting

Upload the contents of the `dist` directory to your web hosting via FTP.

## Customization Guide

### Changing Colors and Theme

Edit the gradient colors and theme in `src/App.tsx` and `src/index.css`.

### Modifying the Layout

The main layout is defined in `src/App.tsx`. You can modify the structure and components as needed.

### Adding New Features

The codebase is modular, allowing you to add new components in the `src/components/` directory and import them in `App.tsx`.

## Troubleshooting

### Audio Playback Issues

If audio doesn't play correctly:
- Check file paths in the `mediaItems` array
- Ensure audio files are in a supported format (WAV, MP3)
- Check browser console for errors

### Upload Functionality

The upload functionality in the development environment stores files in memory. To persist uploads:
- Implement a backend service or use a storage service like Firebase Storage
- Update the `handleFileUpload` function in `App.tsx`

## Technical Details

### Dependencies

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Framer Motion**: Animations
- **Tailwind CSS**: Styling
- **Radix UI**: Accessible UI components

### Browser Compatibility

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Support

For questions or issues, refer to:
- React documentation: [reactjs.org](https://reactjs.org/)
- TypeScript documentation: [typescriptlang.org](https://www.typescriptlang.org/)
- Tailwind CSS documentation: [tailwindcss.com](https://tailwindcss.com/)

---

This guide should provide everything you need to continue developing and enhancing your music portfolio website locally.
