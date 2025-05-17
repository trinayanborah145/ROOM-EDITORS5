import React from 'react';
import SectionHeading from './common/SectionHeading';
import { useInView } from './hooks/useInView';

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Creating a Timeless Room Editors",
    excerpt: "Discover the key elements that make Room Editors designs stand the test of time.",
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    date: "June 15, 2025",
    category: "Design Tips"
  },
  {
    id: 2,
    title: "The Psychology of Color in Room Editors Design",
    excerpt: "How different colors affect mood and behavior in your living spaces.",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    date: "May 22, 2025",
    category: "Color Theory"
  },
  {
    id: 3,
    title: "Small Space Solutions: Maximizing Your Home",
    excerpt: "Creative ways to make the most of limited square footage.",
    image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
    date: "April 10, 2025",
    category: "Space Planning"
  }
];

const BlogSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  
  return (
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading
          title="Our Blog"
          subtitle="Latest insights from our design experts"
        />
        
        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {blogPosts.map((post, index) => (
            <article 
              key={post.id}
              className={`bg-background transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-accent text-sm">{post.category}</span>
                  <span className="text-secondary text-sm">{post.date}</span>
                </div>
                
                <h3 className="font-heading text-xl mb-3 hover:text-accent transition-colors duration-300">
                  <a href="#">{post.title}</a>
                </h3>
                
                <p className="text-secondary mb-4">{post.excerpt}</p>
                
                <a 
                  href="#" 
                  className="inline-block text-primary font-medium border-b-2 border-accent pb-1 hover:text-accent transition-colors duration-300"
                >
                  Read More
                </a>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="#" 
            className="inline-block bg-primary text-white hover:bg-primary/90 py-3 px-8 transition-all duration-300 font-medium"
          >
            View All Posts
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;