import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import SectionHeading from './common/SectionHeading';

const testimonials = [
  {
    id: 1,
    name: "Susmita Choudhury",
    role: "Homeowner",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    quote: "Working with Room Editors transformed our house into the home we've always dreamed of. Their attention to detail and ability to understand our vision was remarkable."
  },
  {
    id: 2,
    name: "Ranjit Borah",
    role: "Restaurant Owner",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    quote: "The team at Room Editors designed a space that perfectly captures the essence of our brand. The result has been incredible – our customers love the ambiance, and business has increased since the redesign."
  },
  {
    id: 3,
    name: "Prachi Aggarwal",
    role: "Office Manager",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    quote: "The redesign of our office space has completely transformed our work environment. Productivity is up, and our team loves coming to work in such a beautiful, functional space."
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  
  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading
          title="Client Testimonials"
          subtitle="What our clients say about our work"
        />
        
        <div className="mt-12 relative max-w-5xl mx-auto">
          <div 
            ref={slideContainerRef}
            className="relative overflow-hidden"
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="min-w-full px-4"
                >
                  <div className="bg-white p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center text-center md:text-left">
                    <div className="mb-6 md:mb-0 md:mr-8">
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto md:mx-0">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-center md:justify-start mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className="text-accent fill-accent" 
                            size={18}
                          />
                        ))}
                      </div>
                      
                      <blockquote className="text-secondary italic mb-6">
                        "{testimonial.quote}"
                      </blockquote>
                      
                      <div>
                        <h4 className="font-heading text-lg">{testimonial.name}</h4>
                        <p className="text-secondary text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <button
              onClick={prevTestimonial}
              className="bg-white hover:bg-accent hover:text-white text-primary p-3 rounded-full shadow-sm transition-all duration-300 mr-2"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextTestimonial}
              className="bg-white hover:bg-accent hover:text-white text-primary p-3 rounded-full shadow-sm transition-all duration-300 ml-2"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="flex justify-center mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                  index === currentIndex ? 'bg-accent' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;