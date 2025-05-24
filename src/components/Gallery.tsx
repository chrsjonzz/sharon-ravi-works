import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMusic, FaImage, FaVideo, FaDownload, FaHeart, FaRegHeart, FaShare, FaPlayCircle } from 'react-icons/fa';
import * as Dialog from '@radix-ui/react-dialog';

interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'audio' | 'video';
  src: string;
  thumbnail?: string;
  description?: string;
  likes?: number;
  isLiked?: boolean;
}

interface GalleryProps {
  items: GalleryItem[];
  onSelect: (item: GalleryItem) => void;
}

const Gallery = ({ items, onSelect }: GalleryProps) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'audio' | 'video' | 'image'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(items);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleItemSelect = (item: GalleryItem) => {
    setSelectedItem(item);
    onSelect(item);
  };

  const handleLike = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setGalleryItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { 
              ...item, 
              isLiked: !item.isLiked,
              likes: item.likes ? (item.isLiked ? item.likes - 1 : item.likes + 1) : 1
            } 
          : item
      )
    );
  };

  const handleShare = (item: GalleryItem, event: React.MouseEvent) => {
    event.stopPropagation();
    // In a real app, this would open a share dialog or copy a link
    alert(`Share link for "${item.title}" copied to clipboard!`);
  };

  const filteredItems = galleryItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getItemIcon = (type: string) => {
    switch(type) {
      case 'audio':
        return <FaMusic className="text-white text-5xl" />;
      case 'video':
        return <FaVideo className="text-white text-5xl" />;
      default:
        return <FaImage className="text-white text-5xl" />;
    }
  };

  return (
    <div className="py-8">
      {/* Search and Filter */}
      <div className="mb-8 glass-morphism rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by title or description..."
              className="custom-input pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => {
                setSearchTerm('');
                searchInputRef.current?.focus();
              }}
            >
              {searchTerm && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center">
            <motion.button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
              onClick={() => setFilter('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            <motion.button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'audio' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
              onClick={() => setFilter('audio')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaMusic /> Audio
            </motion.button>
            <motion.button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'video' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
              onClick={() => setFilter('video')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaVideo /> Video
            </motion.button>
            <motion.button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'image' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
              onClick={() => setFilter('image')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaImage /> Images
            </motion.button>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <FaMusic className="text-gray-600 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400">No items found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredItems.map((galleryItem) => (
            <motion.div
              key={galleryItem.id}
              className="glass-morphism rounded-xl overflow-hidden hover-lift"
              variants={item}
            >
              <div 
                className="relative aspect-square bg-gray-800 cursor-pointer overflow-hidden group"
                onClick={() => handleItemSelect(galleryItem)}
              >
                {galleryItem.thumbnail ? (
                  <img 
                    src={galleryItem.thumbnail} 
                    alt={galleryItem.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-800/50 to-purple-700/50">
                    {getItemIcon(galleryItem.type)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="bg-indigo-600 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {galleryItem.type === 'audio' || galleryItem.type === 'video' ? (
                      <FaPlayCircle size={32} className="text-white" />
                    ) : (
                      <FaImage size={32} className="text-white" />
                    )}
                  </motion.div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white">{galleryItem.title}</h3>
                {galleryItem.description && (
                  <p className="text-gray-300 mt-1 text-sm line-clamp-2">{galleryItem.description}</p>
                )}
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleLike(galleryItem.id, e)}
                      className="text-gray-300 hover:text-pink-500 transition-colors"
                    >
                      {galleryItem.isLiked ? (
                        <FaHeart className="text-pink-500" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>
                    <span className="text-gray-400 text-sm">{galleryItem.likes || 0}</span>
                    
                    <button 
                      onClick={(e) => handleShare(galleryItem, e)}
                      className="text-gray-300 hover:text-indigo-400 transition-colors ml-2"
                    >
                      <FaShare />
                    </button>
                  </div>
                  
                  <motion.a
                    href={galleryItem.src}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaDownload /> Download
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog.Root open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass-morphism rounded-xl p-6 max-w-3xl w-[90vw] max-h-[90vh] overflow-auto z-50">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-2xl font-bold text-white">
                  {selectedItem?.title}
                </Dialog.Title>
                <Dialog.Close className="text-gray-400 hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Dialog.Close>
              </div>
              
              {selectedItem?.type === 'image' ? (
                <img 
                  src={selectedItem.src} 
                  alt={selectedItem.title}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="bg-indigo-900/50 rounded-lg p-4 flex items-center justify-center">
                  {getItemIcon(selectedItem?.type || 'audio')}
                </div>
              )}
              
              {selectedItem?.description && (
                <p className="text-gray-300 mt-4">{selectedItem.description}</p>
              )}
              
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => selectedItem && handleLike(selectedItem.id, {} as React.MouseEvent)}
                    className="text-gray-300 hover:text-pink-500 transition-colors flex items-center gap-2"
                  >
                    {selectedItem?.isLiked ? (
                      <FaHeart className="text-pink-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                    <span>{selectedItem?.likes || 0} likes</span>
                  </button>
                  
                  <button 
                    onClick={() => selectedItem && handleShare(selectedItem, {} as React.MouseEvent)}
                    className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center gap-2"
                  >
                    <FaShare />
                    <span>Share</span>
                  </button>
                </div>
                
                <motion.a
                  href={selectedItem?.src}
                  download
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaDownload /> Download
                </motion.a>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Gallery;
