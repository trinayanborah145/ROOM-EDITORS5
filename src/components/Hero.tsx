import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    title: "Elevate Your Space",
    subtitle: "Award-winning Room Editors design for luxury homes",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    title: "Timeless Elegance",
    subtitle: "Creating spaces that inspire and endure",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
    title: "Functional Beauty",
    subtitle: "Where form meets function in perfect harmony",
  },
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 px-4">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl text-white mb-4 tracking-wider max-w-4xl opacity-0 animate-fadeIn">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-white opacity-80 max-w-2xl mb-8 opacity-0 animate-fadeIn animation-delay-300">
              {slide.subtitle}
            </p>
            <button className="bg-accent hover:bg-accent/90 text-white py-3 px-8 rounded-sm uppercase tracking-wider transition-all duration-300 text-sm font-medium opacity-0 animate-fadeIn animation-delay-600">
              Explore Our Work
            </button>
          </div>
        </div>
      ))}

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-accent w-10' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;