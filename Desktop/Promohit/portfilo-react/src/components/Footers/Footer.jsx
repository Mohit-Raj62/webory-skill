
import { useState, useEffect } from 'react';
// Using anchor tags instead of Link for demo purposes
import { 
  // Mail, 
  // Phone, 
  // MapPin, 
  // Github, 
  // Linkedin, 
  // Twitter, 
  // Instagram,
  ArrowUp,
  Heart,
  Code,
  Coffee,
  // Send
} from 'lucide-react';

const Footer = () => {
  // const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // Show scroll-to-top button when scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // const handleNewsletterSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
    
  //   // Simulate API call
  //   await new Promise(resolve => setTimeout(resolve, 1000));
    
  //   setEmail('');
  //   setIsSubmitting(false);
  //   alert('Thank you for subscribing!');
  // };

  const currentYear = new Date().getFullYear();

  // const socialLinks = [
  //   { icon: Github, href: 'https://github.com/mohitsinha', label: 'GitHub' },
  //   { icon: Linkedin, href: 'https://linkedin.com/in/mohitsinha', label: 'LinkedIn' },
  //   { icon: Twitter, href: 'https://twitter.com/mohitsinha', label: 'Twitter' },
  //   { icon: Instagram, href: 'https://instagram.com/mohitsinha', label: 'Instagram' }
  // ];

  const quickLinks = [
    { to: '/about', label: 'About' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/services', label: 'Services' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' }
  ];

  const services = [
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'Consulting',
    'API Development'
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-500 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* About Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Mohit Sinha
                </h3>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                I&#39;m a passionate full-stack developer who loves creating digital experiences that make a difference. 
                Currently available for new projects and collaborations. Let&#39s build something amazing together!
              </p>

              {/* Contact Info */}
              {/* <div className="space-y-3">
                <div className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 mr-3 text-blue-400" />
                  <span className="text-sm"> Mohitraj7321@gmail.com</span>
                </div>
                <div className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm"> +91 62059 47359</span>
                </div>
                <div className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <MapPin className="w-4 h-4 mr-3 text-red-400" />
                  <span className="text-sm">Dehradun, Uttarakhand, India</span>
                </div>
              </div> */}
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.to}
                      className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index} className="text-gray-300 text-sm">
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          {/* <div className="mt-12 p-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-gray-700">
            <div className="max-w-2xl mx-auto text-center">
              <h4 className="text-xl font-bold mb-3">Stay Updated</h4>
              <p className="text-gray-300 mb-6">Subscribe to get the latest updates on my projects and tech insights.</p>
              
              <div onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={handleNewsletterSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Subscribe
                    </>
                  )}
                </button>
              </div>
            </div> */}
          {/* </div> */}

          {/* Social Links */}
          {/* <div className="mt-12 flex justify-center">
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center text-gray-400 text-sm">
                <span>© {currentYear} Mohit Sinha. Made with</span>
                <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
                <span>and</span>
                <Coffee className="w-4 h-4 mx-1 text-yellow-500" />
              </div>
              
              <div className="flex flex-wrap items-center space-x-6 text-sm">
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-23 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}
    </footer>
  );
};

export default Footer;