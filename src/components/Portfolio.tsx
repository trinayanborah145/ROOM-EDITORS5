import React, { useState } from 'react';
import { useInView } from './hooks/useInView';

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

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { ref } = useInView({ threshold: 0.1 });

  const typedRef = ref as React.RefObject<HTMLDivElement>;

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter((project: Project) => project.category === filter);

  const openVideo = (project: Project) => {
    setSelectedProject(project);
  };

  const closeVideo = () => {
    setSelectedProject(null);
  };

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
            <div key={project.id} className="group relative overflow-hidden rounded-lg cursor-pointer" onClick={() => openVideo(project)}>
              <img src={project.image} alt={project.title} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold">{project.title}</h3>
                <span className="text-accent capitalize text-sm">{project.category}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedProject && selectedProject.video && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl mx-auto">
              <div className="relative w-full max-w-4xl mx-auto bg-black">
                <video
                  src={selectedProject?.video}
                  controls
                  className="w-full max-h-[80vh] object-contain"
                  autoPlay
                />
              </div>
              <button
                onClick={closeVideo}
                className="absolute top-4 right-4 text-white hover:text-accent"
              >
                &times;
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