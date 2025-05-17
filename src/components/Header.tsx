import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <a href="#" className="text-primary font-heading text-2xl font-bold">
          Room Editors<span className="text-accent">.</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {['Home', 'Services', 'Portfolio', 'About', 'Blog', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className={`font-medium transition-all duration-300 hover:text-accent ${
                    isScrolled ? 'text-primary' : 'text-white'
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className={isScrolled ? 'text-primary' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-primary' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0">
          <ul className="flex flex-col py-4">
            {['Home', 'Services', 'Portfolio', 'About', 'Blog', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="block py-3 px-6 text-primary hover:bg-background hover:text-accent transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;