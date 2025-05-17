import React from 'react';
import { PenTool, Home, Layout, Palette, Lightbulb, UserCheck, Tv, Droplets, Utensils, ChefHat } from 'lucide-react';
import SectionHeading from './common/SectionHeading';
import { useInView } from './hooks/useInView';

const services = [
  {
    id: 1,
    icon: <PenTool size={32} />,
    title: "Custom Design",
    description: "Tailored Room Editors design solutions that reflect your unique style and requirements."
  },
  {
    id: 2,
    icon: <Home size={32} />,
    title: "Residential Design",
    description: "Transform your home into a beautiful, functional space that enhances your lifestyle."
  },
  {
    id: 3,
    icon: <Layout size={32} />,
    title: "Commercial Design",
    description: "Create inspiring workspaces that boost productivity and impress clients."
  },
  {
    id: 4,
    icon: <Palette size={32} />,
    title: "Color Consultation",
    description: "Expert color schemes that set the mood and bring harmony to your spaces."
  },
  {
    id: 5,
    icon: <Lightbulb size={32} />,
    title: "Lighting Design",
    description: "Strategic lighting solutions that enhance ambiance and functionality."
  },
  {
    id: 6,
    icon: <UserCheck size={32} />,
    title: "Project Management",
    description: "End-to-end oversight ensuring your project is completed on time and within budget."
  },
  {
    id: 7,
    icon: <Tv size={32} />,
    title: "TV Unit",
    description: "Custom-designed TV units that complement your living space and enhance your viewing experience."
  },
  {
    id: 8,
    icon: <Droplets size={32} />,
    title: "False Ceiling",
    description: "Elegant and functional false ceiling designs that add depth and character to any room."
  },
  {
    id: 9,
    icon: <Utensils size={32} />,
    title: "Full Modular Kitchen",
    description: "Complete kitchen solutions with smart storage and modern design for the heart of your home."
  },
  {
    id: 10,
    icon: <ChefHat size={32} />,
    title: "Semi Modular Kitchen",
    description: "Customizable kitchen designs that blend functionality with your personal style."
  }
];

const Services: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading
          title="Our Services"
          subtitle="Comprehensive design solutions for every space"
        />
        
        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-accent mb-4">{service.icon}</div>
              <h3 className="font-heading text-xl mb-3">{service.title}</h3>
              <p className="text-secondary">{service.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="#contact" 
            className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white py-3 px-8 transition-all duration-300 font-medium"
          >
            Schedule a Consultation
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;