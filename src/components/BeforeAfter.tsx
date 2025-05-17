import React, { useState, useRef, useEffect } from 'react';
import SectionHeading from './common/SectionHeading';

interface BeforeAfterProps {}

const BeforeAfter: React.FC<BeforeAfterProps> = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const beforeImage = "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg";
  const afterImage = "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg";

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    // Calculate position percentage
    let newPosition = (mouseX / containerWidth) * 100;
    
    // Clamp between 0 and 100
    newPosition = Math.min(Math.max(newPosition, 0), 100);
    
    setSliderPosition(newPosition);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const touchX = e.touches[0].clientX - containerRect.left;
    
    // Calculate position percentage
    let newPosition = (touchX / containerWidth) * 100;
    
    // Clamp between 0 and 100
    newPosition = Math.min(Math.max(newPosition, 0), 100);
    
    setSliderPosition(newPosition);
    e.preventDefault();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMoveEvent = (e: MouseEvent) => handleMouseMove(e);
    const handleMouseUpEvent = () => handleMouseUp();
    const handleTouchMoveEvent = (e: TouchEvent) => handleTouchMove(e);
    const handleTouchEndEvent = () => handleMouseUp();

    document.addEventListener('mousemove', handleMouseMoveEvent);
    document.addEventListener('mouseup', handleMouseUpEvent);
    container.addEventListener('touchmove', handleTouchMoveEvent);
    document.addEventListener('touchend', handleTouchEndEvent);

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveEvent);
      document.removeEventListener('mouseup', handleMouseUpEvent);
      container.removeEventListener('touchmove', handleTouchMoveEvent);
      document.removeEventListener('touchend', handleTouchEndEvent);
    };
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading
          title="Before & After"
          subtitle="See the transformation in our design projects"
        />
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div 
            ref={containerRef}
            className="relative h-[400px] md:h-[500px] overflow-hidden cursor-ew-resize"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            {/* Before Image (Full width) */}
            <div className="absolute inset-0">
              <img 
                src={beforeImage} 
                alt="Before renovation" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* After Image (Clipped) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src={afterImage} 
                alt="After renovation" 
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: `${100 / (sliderPosition / 100)}%` }}
                loading="lazy"
              />
            </div>
            
            {/* Slider */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white z-10 cursor-ew-resize flex justify-center items-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                <div className="w-1 h-4 bg-accent"></div>
              </div>
            </div>
            
            {/* Labels */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 text-sm">Before</div>
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 text-sm">After</div>
          </div>
          
          <p className="text-center text-secondary mt-6">
            Drag the slider to see the transformation
          </p>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;