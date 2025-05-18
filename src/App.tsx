import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components
const Hero = lazy(() => import('./components/Hero'));
const Services = lazy(() => import('./components/Services'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const BeforeAfter = lazy(() => import('./components/BeforeAfter'));
const About = lazy(() => import('./components/About'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const BlogSection = lazy(() => import('./components/BlogSection'));
const Contact = lazy(() => import('./components/Contact'));
const Chatbot = lazy(() => import('./components/Chatbot'));

function App() {
  return (
    <div className="font-body bg-background text-primary">
      <Header />
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Hero />
          <Services />
          <Portfolio />
          <BeforeAfter />
          <About />
          <Testimonials />
          <BlogSection />
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </div>
  );
}

export default App;