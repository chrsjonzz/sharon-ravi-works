import { useState } from 'react';
import { motion } from 'framer-motion';
import AudioPlayer from './components/AudioPlayer';
import VideoPlayer from './components/VideoPlayer';
import Gallery from './components/Gallery';
import UploadHandler from './components/UploadHandler';
import { FaMusic, FaVideo, FaImage, FaUpload, FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import './App.css';

// Import audio directly as a URL instead of as a module
const sampleTrackUrl = '/assets/TriTuf.wav';

interface MediaItem {
  id: string;
  title: string;
  type: 'audio' | 'video' | 'image';
  src: string;
  thumbnail?: string;
  description?: string;
  artist?: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'featured' | 'gallery' | 'contact'>('featured');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      title: 'TriTuf',
      type: 'audio',
      src: sampleTrackUrl,
      thumbnail: '/images/studio_microphone.jpeg',
      artist: 'Sharon Ravi',
      description: 'A captivating composition with rich harmonies and dynamic rhythms.'
    },
    {
      id: '2',
      title: 'Studio Session',
      type: 'audio',
      src: sampleTrackUrl,
      thumbnail: '/images/mixing_console.jpeg',
      artist: 'Sharon Ravi',
      description: 'An immersive sonic journey exploring new musical territories.'
    },
    {
      id: '3',
      title: 'Harmonic Waves',
      type: 'audio',
      src: sampleTrackUrl,
      thumbnail: '/images/studio_microphone.jpeg',
      artist: 'Sharon Ravi',
      description: 'Layered textures and evolving harmonies create a mesmerizing atmosphere.'
    }
  ]);

  const handleMediaSelect = (item: MediaItem) => {
    setSelectedMedia(item);
    setActiveTab('featured');
  };

  const handleFileUpload = (file: File) => {
    // Create a URL for the uploaded file
    const fileUrl = URL.createObjectURL(file);
    
    // Determine file type
    let type: 'audio' | 'video' | 'image';
    if (file.type.startsWith('audio/')) {
      type = 'audio';
    } else if (file.type.startsWith('video/')) {
      type = 'video';
    } else {
      type = 'image';
    }
    
    // Create a new media item
    const newItem: MediaItem = {
      id: `upload-${Date.now()}`,
      title: file.name.split('.')[0],
      type,
      src: fileUrl,
      thumbnail: type === 'image' ? fileUrl : (type === 'video' ? '/images/video_thumbnail.jpg' : '/images/audio_thumbnail.jpg'),
      artist: 'Sharon Ravi',
      description: `Uploaded ${type} file: ${file.name}`
    };
    
    // Add to media items
    setMediaItems(prev => [newItem, ...prev]);
    
    // Select the new item
    setSelectedMedia(newItem);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950 to-purple-950 text-white">
      {/* Header */}
      <motion.header 
        className="py-8 px-6 md:px-12 lg:px-24 border-b border-indigo-800/30 backdrop-blur-sm sticky top-0 z-50 bg-gray-950/80"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mb-4 md:mb-0"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400">
              Sharon Ravi Works
            </h1>
            <p className="text-xl text-purple-200 mt-1">Sonic Artistry & Composition</p>
          </motion.div>
          
          <div className="flex gap-4">
            <motion.button
              className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${activeTab === 'featured' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white hover:bg-indigo-900/50'}`}
              onClick={() => setActiveTab('featured')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Featured
            </motion.button>
            <motion.button
              className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${activeTab === 'gallery' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white hover:bg-indigo-900/50'}`}
              onClick={() => setActiveTab('gallery')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Gallery
            </motion.button>
            <motion.button
              className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${activeTab === 'contact' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white hover:bg-indigo-900/50'}`}
              onClick={() => setActiveTab('contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Featured Content */}
          {activeTab === 'featured' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-16"
            >
              <motion.div 
                variants={itemVariants}
                className="relative"
              >
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
                
                <h2 className="text-3xl font-bold mb-8 flex items-center">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg mr-3">
                    {selectedMedia?.type === 'video' ? <FaVideo /> : <FaMusic />}
                  </span>
                  Featured {selectedMedia?.type === 'video' ? 'Video' : 'Track'}
                </h2>
                
                {selectedMedia?.type === 'video' ? (
                  <VideoPlayer 
                    videoSrc={selectedMedia.src} 
                    videoTitle={selectedMedia.title} 
                    artistName={selectedMedia.artist || 'Sharon Ravi'} 
                    posterSrc={selectedMedia.thumbnail}
                  />
                ) : (
                  <AudioPlayer 
                    audioSrc={selectedMedia?.src || sampleTrackUrl} 
                    trackTitle={selectedMedia?.title || 'TriTuf'} 
                    artistName={selectedMedia?.artist || 'Sharon Ravi'} 
                  />
                )}
                
                <div className="mt-8 bg-gradient-to-r from-gray-900/80 to-indigo-900/50 backdrop-blur-sm rounded-xl p-8 border border-indigo-800/30 shadow-xl">
                  <h3 className="text-2xl font-semibold">{selectedMedia?.title || 'TriTuf'}</h3>
                  <p className="text-purple-300 mt-1">{selectedMedia?.artist || 'Sharon Ravi'}</p>
                  <p className="mt-4 text-gray-300 leading-relaxed">{selectedMedia?.description || 'A captivating composition with rich harmonies and dynamic rhythms, showcasing the unique artistic vision and technical mastery that defines Sharon Ravi\'s work. This piece exemplifies the perfect balance between emotional depth and sonic innovation.'}</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold mb-8 flex items-center">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg mr-3">
                    <FaUpload />
                  </span>
                  Share Your Vision
                </h2>
                <UploadHandler onFileUpload={handleFileUpload} />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold mb-8 flex items-center">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg mr-3">
                    <FaMusic />
                  </span>
                  Latest Releases
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mediaItems.slice(0, 3).map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-gradient-to-br from-gray-900/80 to-indigo-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-indigo-800/30 shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer"
                      whileHover={{ y: -5 }}
                      onClick={() => handleMediaSelect(item)}
                    >
                      <div className="h-48 bg-gradient-to-br from-indigo-800/50 to-purple-700/50 flex items-center justify-center overflow-hidden">
                        {item.thumbnail ? (
                          <img 
                            src={item.thumbnail} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        ) : (
                          <FaMusic className="text-white text-5xl" />
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                        <p className="text-gray-300 mt-2 text-sm line-clamp-2">{item.description}</p>
                        <div className="mt-4 flex justify-end">
                          <motion.button
                            className="text-indigo-300 hover:text-white transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {item.type === 'audio' ? 'Listen Now' : item.type === 'video' ? 'Watch Now' : 'View Now'}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Gallery */}
          {activeTab === 'gallery' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">Media Collection</h2>
                  <div className="flex gap-2">
                    <motion.button
                      className="flex items-center gap-2 bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white py-2 px-4 rounded-lg transition-colors shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaMusic /> Audio
                    </motion.button>
                    <motion.button
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white py-2 px-4 rounded-lg transition-colors shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaVideo /> Video
                    </motion.button>
                    <motion.button
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white py-2 px-4 rounded-lg transition-colors shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaImage /> Images
                    </motion.button>
                  </div>
                </div>
                <Gallery items={mediaItems} onSelect={handleMediaSelect} />
              </motion.div>
            </motion.div>
          )}
          
          {/* Contact */}
          {activeTab === 'contact' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-3xl mx-auto"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
                
                <div className="bg-gradient-to-r from-gray-900/80 to-indigo-900/50 backdrop-blur-sm rounded-xl p-8 border border-indigo-800/30 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-semibold text-purple-300">Contact Information</h3>
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 p-3 rounded-full">
                          <FaPhone className="text-white text-xl" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Phone</p>
                          <p className="text-white font-medium">8217721670</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-green-600 p-3 rounded-full">
                          <FaWhatsapp className="text-white text-xl" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">WhatsApp</p>
                          <p className="text-white font-medium">8217721670</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-purple-600 p-3 rounded-full">
                          <FaEnvelope className="text-white text-xl" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white font-medium">contact@sharonravi.works</p>
                        </div>
                      </div>
                      
                      <div className="pt-6">
                        <h4 className="text-lg font-medium mb-3">Working Hours</h4>
                        <p className="text-gray-300">Monday - Friday: 9AM - 6PM</p>
                        <p className="text-gray-300">Saturday: 10AM - 4PM</p>
                        <p className="text-gray-300">Sunday: Closed</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-2xl font-semibold text-purple-300">Send a Message</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                          <input 
                            type="text" 
                            className="w-full bg-gray-800/50 border border-indigo-800/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                          <input 
                            type="email" 
                            className="w-full bg-gray-800/50 border border-indigo-800/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your email"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                          <textarea 
                            className="w-full bg-gray-800/50 border border-indigo-800/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-32"
                            placeholder="How can I help you?"
                          ></textarea>
                        </div>
                        
                        <motion.button
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25 font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Send Message
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="py-12 px-6 md:px-12 lg:px-24 bg-gray-950 border-t border-indigo-900/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">Sharon Ravi Works</h2>
              <p className="text-gray-400 mt-3 leading-relaxed">Creating captivating sonic experiences through innovative composition and sound design. Bringing artistic vision to life through music.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Featured Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-indigo-600/20 p-2 rounded-full">
                  <FaPhone className="text-indigo-400 text-sm" />
                </div>
                <p className="text-gray-400">8217721670</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-600/20 p-2 rounded-full">
                  <FaWhatsapp className="text-green-400 text-sm" />
                </div>
                <p className="text-gray-400">8217721670</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">© {new Date().getFullYear()} Sharon Ravi Works. All Rights Reserved.</p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-500">Crafted with passion and precision</p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;
