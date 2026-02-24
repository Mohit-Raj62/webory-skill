import  { useState } from 'react';
import { ChevronRight, X, Star, ArrowRight, Sparkles, Zap } from 'lucide-react';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  
  // Add custom CSS for Poppins font
  const customStyles = `
    .poppins-font {
      font-family: "Poppins", sans-serif;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
      50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.4); }
    }
    
    .animate-glow {
      animation: glow 2s ease-in-out infinite;
    }
  `;
  
  // Sample services data
  const Services_Data = [
    {
      s_no: "01",
      s_name: "Web Design",
      s_desc: "Create stunning, responsive websites that captivate your audience and drive results.",
      details: "Our web design services include modern, mobile-first designs, user experience optimization, and conversion-focused layouts. We use the latest technologies and design trends to ensure your website stands out.",
      features: ["Responsive Design", "Modern UI/UX", "SEO Optimized", "Fast Loading"],
      price: "Starting at $1,500"
    },
    {
      s_no: "02",
      s_name: "Frontend Development",
      s_desc: "Build interactive and dynamic user interfaces with cutting-edge technologies.",
      details: "Specializing in React, Vue, and modern JavaScript frameworks. We create performant, scalable applications with clean code and best practices.",
      features: ["React/Vue.js", "Modern JavaScript", "API Integration", "Performance Optimization"],
      price: "Starting at $2,000"
    },
    {
      s_no: "03",
      s_name: "Mobile App Development",
      s_desc: "Develop native and cross-platform mobile applications for iOS and Android.",
      details: "From concept to deployment, we build high-quality mobile apps that provide excellent user experiences across all devices and platforms.",
      features: ["iOS & Android", "Cross-platform", "Native Performance", "App Store Deployment"],
      price: "Starting at $3,500"
    },
    {
      s_no: "04",
      s_name: "Digital Marketing",
      s_desc: "Boost your online presence with comprehensive digital marketing strategies.",
      details: "Our digital marketing services include SEO, social media management, content marketing, and paid advertising campaigns to grow your business online.",
      features: ["SEO Optimization", "Social Media", "Content Strategy", "PPC Campaigns"],
      price: "Starting at $800/month"
    },
    {
      s_no: "05",
      s_name: "Brand Identity",
      s_desc: "Create a memorable brand identity that resonates with your target audience.",
      details: "Complete brand identity packages including logo design, color schemes, typography, and brand guidelines to establish a strong market presence.",
      features: ["Logo Design", "Brand Guidelines", "Color Palette", "Typography"],
      price: "Starting at $1,200"
    },
    {
      s_no: "06",
      s_name: "E-commerce Solutions",
      s_desc: "Build powerful online stores that convert visitors into customers.",
      details: "Full-featured e-commerce platforms with payment integration, inventory management, and customer relationship tools to maximize your online sales.",
      features: ["Payment Integration", "Inventory Management", "Order Tracking", "Customer Analytics"],
      price: "Starting at $2,500"
    }
  ];

  const openModal = (service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  return (
    <>
      <style>{customStyles}</style>
    <div id='services' className="services flex flex-col items-center justify-center gap-20 my-20 mx-4 md:mx-20 lg:mx-44 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header Section */}
      <div className="services-title relative flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          <span className="text-purple-300 font-medium tracking-widest uppercase text-sm poppins-font">Professional Services</span>
          <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
        </div>
        <h1 className="px-8 text-4xl md:text-6xl lg:text-7xl font-bold text-center bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl poppins-font">
          My Services
        </h1>
        <div className="mt-4 w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        <p className="mt-6 text-gray-300 text-lg md:text-xl text-center max-w-2xl leading-relaxed poppins-font">
          Crafting digital experiences that captivate, inspire, and deliver exceptional results for your business
        </p>
      </div>

      {/* Services Grid */}
      <div className="services-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {Services_Data.map((service, index) => (
          <div 
            className="service-format group relative flex flex-col justify-between gap-6 p-8 rounded-3xl border border-gray-700/30 bg-black/40 backdrop-blur-xl transition-all duration-700 cursor-pointer hover:border-purple-400/60 hover:bg-gradient-to-br hover:from-purple-900/20 hover:to-pink-900/20 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 transform-gpu" 
            key={index}
            onClick={() => openModal(service)}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-blue-500/10 transition-all duration-700 -z-10"></div>
            
            {/* Service Number with Icon */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-pink-200 transition-all poppins-font">
                  {service.s_no}
                </h3>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" style={{animationDelay: `${i * 100}ms`}} />
                ))}
              </div>
            </div>

            {/* Service Name */}
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:via-pink-200 group-hover:to-blue-200 transition-all duration-500 poppins-font">
              {service.s_name}
            </h2>

            {/* Service Description */}
            <p className="text-gray-300 text-lg leading-relaxed flex-grow group-hover:text-gray-200 transition-colors duration-300 poppins-font">
              {service.s_desc}
            </p>

            {/* Read More Button */}
            <div className="services-readmore flex gap-3 items-center mt-4 group/button p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all duration-300">
              <p className="text-purple-300 hover:text-purple-200 cursor-pointer font-semibold transition-all duration-300 group-hover/button:underline poppins-font text-xl">
                Discover More
              </p>
              <ChevronRight className="w-6 h-6 text-purple-300 group-hover/button:text-purple-200 group-hover/button:translate-x-2 transition-all duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-500">
          <div className="bg-black/90 backdrop-blur-xl rounded-3xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-purple-400/30 shadow-2xl shadow-purple-500/20 animate-in slide-in-from-bottom-8 duration-500 relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20 rounded-3xl -z-10"></div>
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-purple-300 font-bold text-xl poppins-font">{selectedService.s_no}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mt-2 poppins-font">
                  {selectedService.s_name}
                </h2>
              </div>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-all duration-300 p-3 hover:bg-gray-700/50 rounded-full hover:scale-110 transform"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-8">
              <p className="text-gray-300 text-xl leading-relaxed poppins-font">
                {selectedService.details}
              </p>

              {/* Features */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 poppins-font">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedService.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-200 font-medium poppins-font">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30 p-8 rounded-2xl border border-purple-400/30 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-3 poppins-font">Investment</h3>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent poppins-font">
                  {selectedService.price}
                </p>
                <p className="text-gray-400 mt-2 poppins-font">Competitive pricing with exceptional value</p>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group hover:scale-105 transform shadow-lg hover:shadow-purple-500/30">
                <span className="text-xl poppins-font">Start Your Project</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Services;