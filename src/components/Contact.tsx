import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import SectionHeading from './common/SectionHeading';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  message: ''
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData(initialFormData);
        
        // Reset submitted message after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }, 1500);
    }
  };
  
  return (
    <section id="contact" className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading
          title="Contact Us"
          subtitle="Get in touch to discuss your project"
          light
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <div>
            <h3 className="font-heading text-2xl mb-6">Let's create something amazing together</h3>
            <p className="text-white/80 mb-8">
              Whether you're looking to renovate your home, design a commercial space, or need advice on a specific design challenge, we're here to help. Fill out the form and we'll get back to you as soon as possible.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white/10 p-3 rounded-sm mr-4">
                  <MapPin className="text-accent" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Our Location</h4>
                  <p className="text-white/80"> CCMP+CG7, Joy Mangla, Assam 781334</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white/10 p-3 rounded-sm mr-4">
                  <Phone className="text-accent" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Phone Number</h4>
                  <p className="text-white/80">+9169015 98958</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white/10 p-3 rounded-sm mr-4">
                  <Mail className="text-accent" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email Address</h4>
                  <p className="text-white/80">roomeditors1@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white/10 p-3 rounded-sm mr-4">
                  <Clock className="text-accent" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Working Hours</h4>
                  <p className="text-white/80">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-sm text-primary">
            {submitted ? (
              <div className="text-center py-8">
                <h3 className="font-heading text-2xl mb-3 text-accent">Thank You!</h3>
                <p className="text-secondary">Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-primary mb-2 font-medium">Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-accent focus:outline-none transition-colors duration-300`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-primary mb-2 font-medium">Email <span className="text-red-500">*</span></label>
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-accent focus:outline-none transition-colors duration-300`}
                    placeholder="Your email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-primary mb-2 font-medium">Phone</label>
                  <input 
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:border-accent focus:outline-none transition-colors duration-300`}
                    placeholder="Your phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-primary mb-2 font-medium">Message <span className="text-red-500">*</span></label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full p-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:border-accent focus:outline-none transition-colors duration-300`}
                    placeholder="Tell us about your project"
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-accent text-white py-3 px-6 font-medium transition-all duration-300 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-accent/90'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;