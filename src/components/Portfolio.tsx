import React, { useState, useEffect, useRef, useCallback } from 'react';
import OptimizedVideo from './OptimizedVideo';

// Sample project data
const projects = [
  {
    id: 1,
    title: "Minimalist Apartment in Guwahati",
    category: "residential",
    image: "/images/Himat_WeightRoom.webp",
    video: "/videos/amar notun ghor.mp4"
  },
  {
    id: 2,
    title: "Modern Office Space",
    category: "commercial",
    image: "/images/office1.jpg"
  },
  {
    id: 3,
    title: "Luxury Villa",
    category: "residential",
    image: "/images/villa1.jpg"
  },
  {
    id: 4,
    title: "Retail Store Design",
    category: "commercial",
    image: "/images/retail1.jpg"
  },
  {
    id: 5,
    title: "Beach House",
    category: "residential",
    image: "/images/beach1.jpg"
  },
  {
    id: 6,
    title: "Restaurant Interior",
    category: "commercial",
    image: "/images/restaurant1.jpg"
  },
];

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  video?: string;
}

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle project click to open modal
  const handleProjectClick = useCallback((project: Project) => {
    if (!project.video) return;
    
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
    
    // Preload the video for the modal
    const video = document.createElement('video');
    video.src = project.video;
    video.preload = 'auto';
  }, []);
  
  // Close modal and re-enable body scroll
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    
    // Pause any playing videos when modal closes
    const videos = document.querySelectorAll('video');
    videos.forEach(video => video.pause());
  }, []);
  
  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeModal]);

  // Filter projects based on the selected filter
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);
  
  // Get unique categories for filter buttons
  const categories = ['all', ...new Set(projects.map(project => project.category))];
  
  // Don't render anything on server-side
  if (!isClient) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Portfolio</h2>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className={`group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105 ${
                project.video ? 'cursor-pointer' : 'cursor-default'
              }`}
              onClick={() => project.video && handleProjectClick(project)}
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {project.video && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {project.category}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Video Modal */}
        {isModalOpen && selectedProject?.video && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div 
              ref={modalRef}
              className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
            >
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
                aria-label="Close video"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="aspect-video w-full">
                <OptimizedVideo
                  src={selectedProject.video}
                  className="w-full h-full"
                  autoPlay
                  controls
                  loop
                  muted={false}
                  priority="high"
                />
              </div>
              
              <div className="p-4 bg-black text-white">
                <h3 className="text-xl font-semibold">{selectedProject.title}</h3>
                <p className="text-gray-300 capitalize">{selectedProject.category}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
