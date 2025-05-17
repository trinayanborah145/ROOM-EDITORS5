import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import BeforeAfter from './components/BeforeAfter';
import About from './components/About';
import Testimonials from './components/Testimonials';
import BlogSection from './components/BlogSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="font-body bg-background text-primary">
      <Header />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <BeforeAfter />
        <About />
        <Testimonials />
        <BlogSection />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <Chatbot />
    </div>
  );
}

export default App;