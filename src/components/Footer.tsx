import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h2 className="text-2xl font-heading font-bold mb-6">
              Room Editors<span className="text-accent">.</span>
            </h2>
            <p className="text-white/80 mb-6">
              Creating beautiful, functional spaces that inspire and endure. Our passion is transforming your vision into reality.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/room.editors?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-accent p-2 rounded-sm transition-colors duration-300" 
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Services', 'Portfolio', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center"
                  >
                    <ArrowRight size={14} className="mr-2" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-6">Services</h3>
            <ul className="space-y-3">
              {['Residential Design', 'Commercial Design', 'Space Planning', 'Custom Furniture', 'Color Consultation', 'Project Management'].map((item) => (
                <li key={item}>
                  <a 
                    href="#services"
                    className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center"
                  >
                    <ArrowRight size={14} className="mr-2" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-6">Newsletter</h3>
            <p className="text-white/80 mb-4">
              Subscribe to our newsletter to receive updates and design inspiration.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/10 text-white p-3 flex-grow focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button 
                  type="submit" 
                  className="bg-accent hover:bg-accent/90 p-3 transition-colors duration-300"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>
            <p className="text-white/60 text-sm">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>
        
        <hr className="border-white/20 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Room Editors. All rights reserved.
          </p>
          <div className="flex space-x-4 text-white/60 text-sm">
            <a href="#" className="hover:text-accent transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors duration-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;