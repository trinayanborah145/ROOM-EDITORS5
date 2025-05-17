import React from 'react';
import SectionHeading from './common/SectionHeading';
import { useInView } from './hooks/useInView';

const About: React.FC = () => {
  const { ref, inView } = useInView();
  
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div 
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`transition-all duration-1000 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <SectionHeading
              title="About Us"
              subtitle="Designing Beautiful Spaces Since 2022"
              alignment="left"
            />
            
            <p className="text-secondary mt-6 mb-4 leading-relaxed">
            Room Editors was founded in 2022 by Dimpu Baruah and his talented team with a shared passion for thoughtful, impactful design. We believe that well-designed spaces have the power to transform how people feel, interact, and live.

Our team blends creativity, technical expertise, and personal attention to craft spaces that are both aesthetically beautiful and highly functional. Whether residential or commercial, each project is approached with a commitment to timeless design principles and innovative solutions tailored to our clients' unique styles and needs.

In just a few years, Room Editors has built a strong reputation for delivering results that not only meet but exceed expectations. We're here to turn your vision into a space that truly feels like yours.
            </p>
            
            <p className="text-secondary mb-6 leading-relaxed">
            We're here to turn your vision into a space that truly feels like your.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                  <span className="text-accent font-heading font-bold">3+</span>
                </div>
                <span className="ml-4 text-primary font-medium">Years Experience</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                  <span className="text-accent font-heading font-bold">200+</span>
                </div>
                <span className="ml-4 text-primary font-medium">Projects Completed</span>
              </div>
            </div>
          </div>
          
          <div 
            className={`grid grid-cols-2 gap-4 transition-all duration-1000 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="space-y-4">
              <img 
                src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg" 
                alt="Room Editors design project" 
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <img 
                src="https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg" 
                alt="Room Editors design project" 
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-4 pt-10">
              <img 
                src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg" 
                alt="Room Editors design project" 
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <img 
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" 
                alt="Room Editors design project" 
                className="w-full h-64 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;