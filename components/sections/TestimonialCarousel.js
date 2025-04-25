import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    quote: "FiscalFusion has transformed how I manage my business finances. The reporting tools are invaluable for my quarterly planning sessions.",
    author: "Sarah Johnson",
    position: "Small Business Owner",
    avatar: "/images/testimonials/avatar-1.jpg",
    avatarColor: "bg-blue-600",
    initials: "SJ",
    rating: 5,
  },
  {
    id: 2,
    quote: "I've tried several financial management tools, but FiscalFusion is by far the most intuitive and comprehensive. Love the budgeting features!",
    author: "Michael Chen",
    position: "Financial Analyst",
    avatar: "/images/testimonials/avatar-2.jpg",
    avatarColor: "bg-purple-600",
    initials: "MC",
    rating: 5,
  },
  {
    id: 3,
    quote: "The expense tracking features have helped me save over $500 monthly by identifying spending patterns I wasn't aware of.",
    author: "Jessica Williams",
    position: "Marketing Director",
    avatar: "/images/testimonials/avatar-3.jpg",
    avatarColor: "bg-green-600",
    initials: "JW",
    rating: 4,
  },
  {
    id: 4,
    quote: "Managing our family budget has never been easier. The bill reminders alone are worth the subscription.",
    author: "David Rodriguez",
    position: "Software Engineer",
    avatar: "/images/testimonials/avatar-4.jpg",
    avatarColor: "bg-amber-600",
    initials: "DR",
    rating: 5,
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${
            i < rating ? 'text-yellow-400' : 'text-gray-600'
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ))}
    </div>
  );
};

const TestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-20 bg-gradient-to-b from-gray-900/50 to-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            What Our <span className="text-blue-400">Users Say</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Join thousands of satisfied users who have transformed their financial management.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="w-full flex-shrink-0 flex flex-col items-center px-4"
              >
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-xl w-full max-w-2xl mx-auto">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full overflow-hidden mr-4 ${testimonial.avatarColor} relative flex items-center justify-center text-white font-medium`}>
                        {testimonial.initials}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {testimonial.author}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {testimonial.position}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={testimonial.rating} />
                  </div>
                  <blockquote className="text-gray-300 text-lg italic">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  activeIndex === index ? 'bg-blue-500' : 'bg-gray-600'
                } transition-colors duration-300`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel; 