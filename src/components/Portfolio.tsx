import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useInView } from './hooks/useInView';
import OptimizedImage from './OptimizedImage';
import OptimizedVideo from './OptimizedVideo';


interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  video?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Minimalist Apartment in Guwahati",
    category: "residential",
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    video: "/videos/amar notun ghor.mp4"
  },
  {
    id: 2,
    title: "Full Interior House Design in Goalpara",
    category: "residential",
    image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
    video: "/videos/RESIDENTIAL.mp4"
  },
  {
    id: 3,
    title: "Mobile Store Design in Pathsala",
    category: "commercial",
    image: "01-channel-flagship-interior-store-bangalore-1-720x395.jpg",
    video: "/videos/pathshala.mp4"
  },
  {
    id: 4,
    title: "Corporate Office Space in Dibrugarh",
    category: "commercial",
    image: "https://images.pexels.com/photos/3932930/pexels-photo-3932930.jpeg",
    video: "/videos/notunbb.mp4"
  },
  {
    id: 5,
    title: "Full Modular Kitchen in Golaghat",
    category: "residential2",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    video: "/videos/Modular Kitchen.mp4"
  },
  {
    id: 6,
    title: "School Cabin Design in Goalpara",
    category: "commercial",
    image: "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg",
    video: "/videos/KINGKOR.mp4"
  },
  {
    id: 7,
    title: "Luxury GYM Design in Guwahati",
    category: "commercial",
    image: "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg",
    video: "/videos/GYM.mp4"
  },
  {
    id: 8,
    title: "Super Mart Design in Bongaigaon",
    category: "commercial",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    video: "/videos/bongaigaon.mp4"
  },
  {
    id: 9,
    title: "Flat Interior Design in Six-Mile",
    category: "residential",
    image: "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg",
    video: "/videos/dbre.mp4"
  }
];

// Cache for video poster images
const videoPosters: Record<string, string> = {};

// Function to get a poster image for a video
const getVideoPoster = (videoUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    if (videoPosters[videoUrl]) {
      resolve(videoPosters[videoUrl]);
      return;
    }

    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      // Seek to a frame to capture as poster
      video.currentTime = Math.min(1, video.duration * 0.1); // Try to get a frame at 10% of the video
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const posterUrl = canvas.toDataURL('image/jpeg', 0.8);
        videoPosters[videoUrl] = posterUrl;
        resolve(posterUrl);
      } else {
        resolve('');
      }
    };

    video.onerror = () => {
      resolve('');
    };
  });
};

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoPoster, setVideoPoster] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref } = useInView({ threshold: 0.1 });
  const typedRef = ref as React.RefObject<HTMLDivElement>;
  const videoPreloadCache = useRef<Record<string, boolean>>({});
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Filter projects based on the selected filter
  useEffect(() => {
    const filtered = filter === "all" 
      ? [...projects] 
      : projects.filter((project: Project) => project.category === filter);
    setFilteredProjects(filtered);
  }, [filter]);

  // Handle video poster generation when a project is selected
  useEffect(() => {
    if (!selectedProject?.video) return;

    const generatePoster = async () => {
      try {
        const poster = await getVideoPoster(selectedProject.video!);
        setVideoPoster(poster);
      } catch (error) {
        console.error('Error generating video poster:', error);
      }
    };

    generatePoster();
  }, [selectedProject]);

  const openVideo = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsVideoLoading(true);
    
    // Start preloading the video in the background
    if (project.video && !videoPreloadCache.current[project.video]) {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = project.video;
      video.load();
      videoPreloadCache.current[project.video] = true;
    }
  }, []);

  const closeVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setSelectedProject(null);
    setVideoPoster('');
  }, []);

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold mb-4">Our Portfolio</h2>
        <p className="text-lg text-gray-600 mb-8">Showcasing our finest interior design projects</p>
        
        <div className="flex justify-center mt-10 mb-12">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 mr-4 ${filter === "all" ? "bg-primary text-white" : "border border-primary text-primary hover:bg-primary hover:text-white"} transition-all duration-300 rounded`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("residential")}
            className={`px-6 py-2 mr-4 ${filter === "residential" ? "bg-primary text-white" : "border border-primary text-primary hover:bg-primary hover:text-white"} transition-all duration-300 rounded`}
          >
            Residential
          </button>
          <button
            onClick={() => setFilter("commercial")}
            className={`px-6 py-2 ${filter === "commercial" ? "bg-primary text-white" : "border border-primary text-primary hover:bg-primary hover:text-white"} transition-all duration-300 rounded`}
          >
            Commercial
          </button>
        </div>

        <div 
          ref={typedRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="group relative overflow-hidden rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
              onClick={() => openVideo(project)}
            >
              <div className="relative aspect-video">
                <OptimizedImage 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <h3 className="text-white text-lg md:text-xl font-semibold mb-2">{project.title}</h3>
                  <span className="text-accent text-sm px-3 py-1 bg-black bg-opacity-50 rounded-full">
                    {project.category}
                  </span>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedProject && selectedProject.video && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeVideo}
          >
            <div 
              className="relative w-full max-w-6xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative pt-[56.25%] w-full">
                <div className="absolute inset-0 w-full h-full">
                  <OptimizedVideo
                    src={selectedProject.video}
                    placeholderSrc={videoPoster}
                    className="w-full h-full object-contain"
                    autoPlay
                    controls
                    loop
                    onVideoClick={closeVideo}
                    onCanPlay={() => setIsVideoLoading(false)}
                    onWaiting={() => setIsVideoLoading(true)}
                  />
                </div>
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="w-16 h-16 border-t-2 border-primary border-solid rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="p-4 bg-black bg-opacity-70">
                <h3 className="text-white text-xl font-semibold mb-2">{selectedProject.title}</h3>
                <p className="text-gray-300 text-sm">{selectedProject.category}</p>
              </div>
              <button
                onClick={closeVideo}
                className="absolute top-6 right-6 w-16 h-16 rounded-full bg-black bg-opacity-80 text-white hover:bg-opacity-100 transition-all duration-200 flex items-center justify-center shadow-lg hover:scale-110 transform"
                aria-label="Close video"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="text-center mt-12">
          <button className="bg-primary text-white hover:bg-primary/90 py-3 px-8 transition-all duration-300 font-medium">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;