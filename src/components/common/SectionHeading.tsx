import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  light?: boolean;
  alignment?: 'center' | 'left' | 'right';
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  title, 
  subtitle, 
  light = false,
  alignment = 'center'
}) => {
  const getAlignment = () => {
    switch (alignment) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      default:
        return 'text-center';
    }
  };
  
  return (
    <div className={`mb-10 max-w-xl ${alignment === 'center' ? 'mx-auto' : ''} ${getAlignment()}`}>
      <h2 className={`font-heading text-3xl md:text-4xl mb-4 ${light ? 'text-white' : 'text-primary'}`}>
        {title}
      </h2>
      <p className={light ? 'text-white/80' : 'text-secondary'}>
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeading;