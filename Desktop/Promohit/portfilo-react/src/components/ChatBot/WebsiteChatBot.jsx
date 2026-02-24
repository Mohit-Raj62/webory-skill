import { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon, TrashIcon, BookmarkIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';

// Enhanced website information database
const websiteInfo = {
  home: {
    title: ["Welcome to My Portfolio", "Mohit Sinha"],
    description: "I'm a professional web developer specializing in creating responsive, modern, and performance-optimized web applications. I transform ideas into digital reality.",
    tagline: "Crafting Digital Experiences That Matter",
    highlights: ["5+ Years Experience", "50+ Projects Completed", "100% Client Satisfaction"]
  },
  about: {
    title: "About Me",
    description: "I'm a passionate full-stack web developer with expertise in creating user-friendly interfaces and powerful applications that drive business growth.",
    skills: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "AWS", "Docker", "Git", "Figma", "Responsive Design", "UI/UX Design", "API Development"],
    experience: "Over 5 years of experience in web development and design.",
    education: "Bachelor's in Computer Science, certified in AWS Cloud Solutions",
    certifications: ["AWS Certified Developer", "Google Analytics Certified", "React Professional Certificate"],
    languages: ["English (Native)", "Hindi (Native)", "Spanish (Conversational)"],
    interests: ["Open Source Contributing", "Tech Blogging", "Photography", "Traveling"]
  },
  portfolio: {
    title: "My Work",
    description: "A showcase of my best projects and client work, demonstrating expertise across various industries and technologies.",
    projects: [
      {
        name: "E-commerce Platform",
        tech: "React, Node.js, MongoDB",
        description: "Full-stack e-commerce solution with payment integration",
        status: "Live"
      },
      {
        name: "Portfolio Template",
        tech: "Next.js, Tailwind CSS",
        description: "Modern portfolio template for developers and designers",
        status: "Open Source"
      },
      {
        name: "Business Dashboard",
        tech: "React, D3.js, Express",
        description: "Analytics dashboard for business intelligence",
        status: "Enterprise"
      },
      {
        name: "Mobile App UI",
        tech: "React Native, Expo",
        description: "Cross-platform mobile application interface",
        status: "App Store"
      },
      {
        name: "Corporate Website",
        tech: "WordPress, PHP, MySQL",
        description: "Custom WordPress theme for corporate clients",
        status: "Live"
      },
      {
        name: "Learning Management System",
        tech: "MERN Stack, Socket.io",
        description: "Online education platform with real-time features",
        status: "Beta"
      }
    ],
    technologies: ["Frontend", "Backend", "Database", "Cloud", "Mobile", "CMS"],
    githubStats: {
      repositories: 45,
      stars: 230,
      contributions: 1250
    }
  },
  services: {
    title: "Services I Offer",
    description: "Professional web development services tailored to your specific business needs and goals.",
    offerings: [
      {
        name: "Custom Website Development",
        description: "Build from scratch tailored to your brand",
        price: "Starting at $2,000",
        duration: "2-4 weeks"
      },
      {
        name: "UI/UX Design",
        description: "User-centered design that converts visitors",
        price: "Starting at $800",
        duration: "1-2 weeks"
      },
      {
        name: "React Application Development",
        description: "Modern, scalable React applications",
        price: "Starting at $3,000",
        duration: "3-6 weeks"
      },
      {
        name: "E-commerce Solutions",
        description: "Complete online stores with payment integration",
        price: "Starting at $4,000",
        duration: "4-8 weeks"
      },
      {
        name: "Web Performance Optimization",
        description: "Speed up your existing website",
        price: "Starting at $500",
        duration: "1 week"
      },
      {
        name: "Website Maintenance",
        description: "Ongoing support and updates",
        price: "$200/month",
        duration: "Ongoing"
      },
      {
        name: "SEO Optimization",
        description: "Improve search engine rankings",
        price: "Starting at $600",
        duration: "2-3 weeks"
      },
      {
        name: "API Development",
        description: "Custom REST APIs and integrations",
        price: "Starting at $1,500",
        duration: "2-3 weeks"
      }
    ],
    process: ["Discovery & Planning", "Design & Prototyping", "Development", "Testing", "Deployment", "Maintenance"],
    guarantees: ["Money-back guarantee", "Free revisions", "24/7 support", "1-year warranty"]
  },
  contact: {
    title: "Get In Touch",
    email: "Mohit9470sinha@gmail.com",
    phone: "+91 94705 12345",
    location: "Dehradun, Uttarakhand, India",
    timezone: "IST (UTC+5:30)",
    social: {
      linkedin: "linkedin.com/in/mohitsinha",
      github: "github.com/mohitsinha",
      twitter: "@mohitsinhadev",
      instagram: "@mohit.codes"
    },
    methods: ["Contact Form", "Email", "Phone", "WhatsApp", "Social Media", "Video Call"],
    availability: "Monday-Friday: 9 AM - 6 PM IST",
    responseTime: "Within 24 hours"
  },
  testimonials: [
    {
      name: "Sarah Johnson",
      company: "TechStart Inc.",
      text: "Mohit delivered an exceptional website that exceeded our expectations. Professional and reliable!",
      rating: 5
    },
    {
      name: "David Chen",
      company: "E-commerce Plus",
      text: "The e-commerce platform Mohit built increased our sales by 40%. Highly recommended!",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      company: "Design Studio",
      text: "Beautiful UI/UX design and flawless implementation. Will definitely work with Mohit again.",
      rating: 5
    }
  ],
  faq: [
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary based on complexity. Simple websites take 1-2 weeks, while complex applications can take 4-8 weeks. I provide detailed timelines during consultation."
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes! I offer maintenance packages and provide 1 year of free bug fixes and minor updates for all projects."
    },
    {
      question: "What technologies do you specialize in?",
      answer: "I specialize in modern web technologies including React, Next.js, Node.js, and cloud platforms like AWS. I stay updated with the latest industry trends."
    },
    {
      question: "Can you work with my existing team?",
      answer: "Absolutely! I collaborate well with existing development teams and can integrate seamlessly into your workflow."
    },
    {
      question: "Do you offer payment plans?",
      answer: "Yes, I offer flexible payment plans with 50% upfront and 50% upon completion for most projects."
    }
  ],
  blog: [
    {
      title: "10 React Best Practices for 2024",
      date: "2024-11-15",
      summary: "Essential React patterns and practices every developer should know"
    },
    {
      title: "Web Performance Optimization Guide",
      date: "2024-10-28",
      summary: "How to make your website lightning fast with proven techniques"
    },
    {
      title: "The Future of Web Development",
      date: "2024-10-10",
      summary: "Emerging trends and technologies shaping web development"
    }
  ]
};

// Enhanced time-based greeting with more variations
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  const greetings = {
    morning: ["Good morning!", "Rise and shine!", "Morning!", "Top of the morning!"],
    afternoon: ["Good afternoon!", "Hope you're having a great day!", "Afternoon!", "Good day!"],
    evening: ["Good evening!", "Hope your evening is going well!", "Evening!", "Good evening to you!"],
    night: ["Good night!", "Working late?", "Hello there!", "Hope you're well!"]
  };
  
  let timeOfDay, selectedGreetings;
  
  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
  } else if (hour >= 17 && hour < 22) {
    timeOfDay = 'evening';
  } else {
    timeOfDay = 'night';
  }
  
  selectedGreetings = greetings[timeOfDay];
  return selectedGreetings[Math.floor(Math.random() * selectedGreetings.length)];
};

// Enhanced response generation with more intelligence
const generateResponse = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Greetings
  if (lowerQuery.match(/\b(hello|hi|hey|greetings|good morning|good afternoon|good evening)\b/)) {
    const timeGreeting = getTimeBasedGreeting();
    return `${timeGreeting} I'm Mohit's website assistant. I can help you learn about his skills, projects, services, and how to get in touch. What would you like to know?`;
  }
  
  // Time queries
  if (lowerQuery.includes('time') || lowerQuery.includes('timezone')) {
    const now = new Date();
    return `It's currently ${now.toLocaleTimeString()} IST (Indian Standard Time). Mohit is available ${websiteInfo.contact.availability} and typically responds ${websiteInfo.contact.responseTime}.`;
  }
  
  // Home/Welcome section
  if (lowerQuery.match(/\b(home|welcome|landing|main|intro)\b/)) {
    return `${websiteInfo.home.title.join(' - ')}! ${websiteInfo.home.description} 

✨ ${websiteInfo.home.tagline}

Key highlights: ${websiteInfo.home.highlights.join(' • ')}`;
  }
  
  // About section with sub-categories
  if (lowerQuery.match(/\b(about|who|skills|experience|education|background|biography)\b/)) {
    if (lowerQuery.includes('skill')) {
      return `My technical skills include:

💻 Frontend: ${websiteInfo.about.skills.slice(0, 6).join(', ')}
⚙️ Backend: ${websiteInfo.about.skills.slice(6, 10).join(', ')}
☁️ Cloud & Tools: ${websiteInfo.about.skills.slice(10).join(', ')}

I'm always learning new technologies to stay current with industry trends!`;
    } else if (lowerQuery.includes('education') || lowerQuery.includes('qualification')) {
      return `Education & Certifications:
🎓 ${websiteInfo.about.education}
📜 Certifications: ${websiteInfo.about.certifications.join(', ')}
🌍 Languages: ${websiteInfo.about.languages.join(', ')}`;
    } else if (lowerQuery.includes('interest') || lowerQuery.includes('hobby')) {
      return `When I'm not coding, I enjoy: ${websiteInfo.about.interests.join(', ')}. These activities help me stay creative and bring fresh perspectives to my work!`;
    } else {
      return `About Mohit Sinha:
${websiteInfo.about.description}

📚 ${websiteInfo.about.education}
💼 ${websiteInfo.about.experience}
🏆 Key certifications: ${websiteInfo.about.certifications.slice(0, 2).join(', ')}

Feel free to ask about my specific skills, education, or interests!`;
    }
  }
  
  // Portfolio section with detailed project info
  if (lowerQuery.match(/\b(portfolio|work|project|github|code|repository)\b/)) {
    if (lowerQuery.includes('github') || lowerQuery.includes('stat')) {
      return `GitHub Statistics:
📂 ${websiteInfo.portfolio.githubStats.repositories} repositories
⭐ ${websiteInfo.portfolio.githubStats.stars} stars earned
📈 ${websiteInfo.portfolio.githubStats.contributions}+ contributions this year

Check out my work on GitHub for open-source contributions and code samples!`;
    } else if (lowerQuery.includes('technology') || lowerQuery.includes('tech stack')) {
      return `I work across the full technology stack:
${websiteInfo.portfolio.technologies.join(' • ')}

Each project uses the best technologies for the specific requirements and goals.`;
    } else if (lowerQuery.includes('detail') || lowerQuery.includes('specific')) {
      let projectDetails = "Here are some detailed project examples:\n\n";
      websiteInfo.portfolio.projects.slice(0, 3).forEach((project, index) => {
        projectDetails += `${index + 1}. ${project.name}
   Tech: ${project.tech}
   Status: ${project.status}
   ${project.description}\n\n`;
      });
      return projectDetails + "Would you like to know more about any specific project?";
    } else {
      return `${websiteInfo.portfolio.title}: ${websiteInfo.portfolio.description}

Recent projects: ${websiteInfo.portfolio.projects.slice(0, 4).map(p => p.name).join(', ')} and more!

I've completed ${websiteInfo.portfolio.projects.length}+ projects across various industries. Ask me about specific technologies or project details!`;
    }
  }
  
  // Services with pricing and details
  if (lowerQuery.match(/\b(service|offer|price|cost|hire|work together|what you do)\b/)) {
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('pricing')) {
      let pricingInfo = "Here's my service pricing:\n\n";
      websiteInfo.services.offerings.slice(0, 4).forEach(service => {
        pricingInfo += `💰 ${service.name}: ${service.price} (${service.duration})\n`;
      });
      pricingInfo += "\n💡 All projects include: " + websiteInfo.services.guarantees.join(', ');
      return pricingInfo;
    } else if (lowerQuery.includes('process') || lowerQuery.includes('how do you work')) {
      return `My development process:
${websiteInfo.services.process.map((step, index) => `${index + 1}. ${step}`).join('\n')}

This ensures quality delivery and keeps you involved throughout the project!`;
    } else if (lowerQuery.includes('guarantee') || lowerQuery.includes('warranty')) {
      return `I provide these guarantees for all projects:
✅ ${websiteInfo.services.guarantees.join('\n✅ ')}

Your satisfaction is my priority!`;
    } else {
      return `${websiteInfo.services.title}: ${websiteInfo.services.description}

Popular services:
• ${websiteInfo.services.offerings.slice(0, 4).map(s => `${s.name} (${s.price})`).join('\n• ')}

I offer ${websiteInfo.services.offerings.length} different services. Ask about pricing, process, or specific services!`;
    }
  }
  
  // Contact information
  if (lowerQuery.match(/\b(contact|reach|email|phone|social|location|hire)\b/)) {
    if (lowerQuery.includes('social')) {
      let socialInfo = "Connect with me on social media:\n";
      for (const [platform, handle] of Object.entries(websiteInfo.contact.social)) {
        socialInfo += `${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${handle}\n`;
      }
      return socialInfo;
    } else if (lowerQuery.includes('location') || lowerQuery.includes('where')) {
      return `📍 Location: ${websiteInfo.contact.location}
🕐 Timezone: ${websiteInfo.contact.timezone}
⏰ Availability: ${websiteInfo.contact.availability}
⚡ Response time: ${websiteInfo.contact.responseTime}`;
    } else {
      return `${websiteInfo.contact.title}:

📧 Email: ${websiteInfo.contact.email}
📱 Phone: ${websiteInfo.contact.phone}
📍 Location: ${websiteInfo.contact.location}
⏰ Available: ${websiteInfo.contact.availability}

Contact methods: ${websiteInfo.contact.methods.join(', ')}
I respond ${websiteInfo.contact.responseTime}!`;
    }
  }

  // Testimonials
  if (lowerQuery.match(/\b(testimonial|review|client|feedback|recommendation)\b/)) {
    let testimonialText = "Here's what clients say about my work:\n\n";
    websiteInfo.testimonials.forEach((testimonial, index) => {
      testimonialText += `⭐⭐⭐⭐⭐ "${testimonial.text}"\n- ${testimonial.name}, ${testimonial.company}\n\n`;
    });
    return testimonialText + "I'm proud to maintain 100% client satisfaction!";
  }

  // FAQ
  if (lowerQuery.match(/\b(faq|question|how long|support|payment|team)\b/)) {
    const matchedFAQ = websiteInfo.faq.find(faq => 
      lowerQuery.includes(faq.question.toLowerCase().split(' ')[0]) ||
      faq.question.toLowerCase().includes(lowerQuery.split(' ')[0])
    );
    
    if (matchedFAQ) {
      return `❓ ${matchedFAQ.question}\n💡 ${matchedFAQ.answer}`;
    } else {
      return "Frequently Asked Questions:\n\n" + 
        websiteInfo.faq.slice(0, 3).map(faq => `❓ ${faq.question}\n💡 ${faq.answer}`).join('\n\n') +
        "\n\nHave a specific question? Just ask!";
    }
  }

  // Blog
  if (lowerQuery.match(/\b(blog|article|post|read|writing)\b/)) {
    let blogInfo = "Latest blog posts:\n\n";
    websiteInfo.blog.forEach(post => {
      blogInfo += `📝 ${post.title}\n📅 ${post.date}\n${post.summary}\n\n`;
    });
    return blogInfo + "I regularly share insights about web development and tech trends!";
  }

  // Navigation help
  if (lowerQuery.match(/\b(navigate|find|where|section|page)\b/)) {
    return `Website Navigation Help:
🏠 Home - Welcome and overview
👤 About - Skills, experience, and background  
💼 Portfolio - Projects and work samples
🛠️ Services - What I offer and pricing
📞 Contact - Get in touch information
📝 Blog - Latest articles and insights

You can also ask me about testimonials, FAQs, or specific topics!`;
  }

  // Default intelligent response
  const keywordResponses = {
    'react': 'I specialize in React development! I can build modern, scalable React applications with hooks, context, and performance optimization.',
    'javascript': 'JavaScript is my core language! I work with ES6+, async/await, and modern JS frameworks daily.',
    'website': 'I create custom websites tailored to your needs - from simple landing pages to complex web applications.',
    'mobile': 'I develop mobile-responsive websites and React Native apps for cross-platform mobile solutions.',
    'seo': 'I provide SEO optimization services to improve your search engine rankings and online visibility.',
    'ecommerce': 'I build complete e-commerce solutions with payment integration, inventory management, and admin panels.',
    'api': 'I develop custom REST APIs and integrate third-party services for seamless data flow.',
    'hosting': 'I can help deploy your website on various platforms including AWS, Netlify, and Vercel.',
    'maintenance': 'I offer ongoing website maintenance, updates, and technical support services.',
    'design': 'I provide UI/UX design services focused on user experience and conversion optimization.'
  };

  for (const [keyword, response] of Object.entries(keywordResponses)) {
    if (lowerQuery.includes(keyword)) {
      return response + "\n\nWould you like to know more about this service or see related projects?";
    }
  }

  // Default fallback with suggestions
  return `I'd be happy to help! I can provide information about:

🏠 Home & Introduction
👤 About Mohit (skills, experience, education)  
💼 Portfolio & Projects (with tech details)
🛠️ Services & Pricing
📞 Contact Information
⭐ Client Testimonials
❓ Frequently Asked Questions
📝 Latest Blog Posts

Just ask about any of these topics, or try a more specific question!`;
};

const WebsiteChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: `${getTimeBasedGreeting()} I'm Mohit's website assistant! I can tell you about his skills, projects, services, and help you get in touch. What would you like to know?`, 
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const [suggestedQuestions] = useState([
    "Tell me about Mohit's skills",
    "What services do you offer?",
    "Show me recent projects",
    "How can I contact Mohit?",
    "What are your rates?",
    "Client testimonials"
  ]);

  const [quickActions] = useState([
    "📧 Get Contact Info",
    "💼 View Portfolio", 
    "🛠️ See Services",
    "⭐ Read Reviews",
    "💰 Check Pricing",
    "❓ View FAQ"
  ]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Save chat history
  useEffect(() => {
    if (messages.length > 1) {
      setChatHistory(prev => [...prev.slice(-10), ...messages.slice(-2)]);
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage = { 
      id: Date.now(), 
      text: inputValue, 
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsTyping(true);
    
    const responseTime = Math.min(inputValue.length * 30 + 500, 2500);
    
    setTimeout(() => {
      const botResponse = { 
        id: Date.now() + 1, 
        text: generateResponse(inputValue), 
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, responseTime);
    
    setInputValue('');
  };

  const handleQuickAction = (action) => {
    const actionMap = {
      "📧 Get Contact Info": "How can I contact Mohit?",
      "💼 View Portfolio": "Show me your portfolio and projects",
      "🛠️ See Services": "What services do you offer?",
      "⭐ Read Reviews": "Show me client testimonials",
      "💰 Check Pricing": "What are your pricing and rates?",
      "❓ View FAQ": "Show me frequently asked questions"
    };
    
    const query = actionMap[action] || action;
    handleSuggestedQuestion(query);
  };

  const handleSuggestedQuestion = (question) => {
    const userMessage = { 
      id: Date.now(), 
      text: question, 
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsTyping(true);
    
    setTimeout(() => {
      const botResponse = { 
        id: Date.now() + 1, 
        text: generateResponse(question), 
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const addToFavorites = (messageId) => {
    const message = messages.find(m => m.id === messageId);
    if (message && !favorites.find(f => f.id === messageId)) {
      setFavorites(prev => [...prev, message]);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1, 
      text: `${getTimeBasedGreeting()} Chat cleared! I'm here to help you learn about Mohit's work. What would you like to know?`, 
      isBot: true,
      timestamp: new Date()
    }]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Enhanced chat toggle button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 focus:outline-none transform hover:scale-105"
          aria-label="Toggle chat"
        >
          {isOpen ? 
            <XMarkIcon className="h-7 w-7" /> :
            <div className="flex flex-col items-center">
              <ChatBubbleLeftRightIcon className="h-7 w-7" />
              <span className="text-xs mt-1 font-medium">Chat</span>
            </div>
          }
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>
        </button>
      </div>

      {/* Enhanced chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden animate-slideUp">
          {/* Enhanced header */}
          <div className="flex h-16 items-center justify-between bg-gradient-to-r from-green-500 to-green-600 px-4">
            <div className="flex items-center">
              <div className="relative">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white mr-3" />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-300 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Website Assistant</h3>
                <p className="text-xs text-green-100">Online • Responds quickly</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={clearChat}
                className="rounded-full p-2 text-green-100 hover:text-white hover:bg-white/20 transition-colors"
                title="Clear chat"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-green-100 hover:text-white hover:bg-white/20 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 ${message.isBot ? '' : 'flex justify-end'}`}
              >
                <div className={`group relative rounded-2xl px-4 py-3 max-w-[85%] shadow-sm ${
                  message.isBot 
                    ? 'bg-white border border-gray-200 text-gray-800' 
                    : 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                }`}>
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  <div className={`text-xs mt-2 ${message.isBot ? 'text-gray-400' : 'text-green-100'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                  
                  {/* Message actions */}
                  {message.isBot && (
                    <button
                      onClick={() => addToFavorites(message.id)}
                      className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                      title="Save to favorites"
                    >
                      <BookmarkIcon className="h-3 w-3 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Enhanced typing indicator */}
            {isTyping && (
              <div className="flex mb-4">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Assistant is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-600 mb-2 font-medium">Quick Actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="text-xs bg-white hover:bg-gray-100 border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 transition-colors shadow-sm"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Questions */}
          {messages.length <= 3 && (
            <div className="border-t border-gray-200 bg-blue-50 px-4 py-3">
              <p className="text-xs text-blue-600 mb-2 font-medium">💡 Try asking:</p>
              <div className="space-y-2">
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full text-left text-xs bg-white hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-2 text-blue-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced input area */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-40 bg-black">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  ref={inputRef}
                  placeholder="Ask me anything about Mohit's work..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {inputValue.length}/500
                </div>
              </div>
              <button
                type="submit"
                disabled={inputValue.trim() === '' || isTyping}
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-3 text-white hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Favorites panel (if any) */}
          {favorites.length > 0 && (
            <div className="border-t border-gray-200 bg-yellow-50 px-4 py-2">
              <p className="text-xs text-yellow-700 font-medium flex items-center">
                <StarIcon className="h-3 w-3 mr-1" />
                Saved ({favorites.length})
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

// Enhanced custom styles
const customStyles = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .animate-slideUp {
    animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }
  
  .animate-bounce {
    animation: bounce 1.4s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Custom scrollbar */
  .overflow-y-auto::-webkit-scrollbar {
    width: 4px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* Message animations */
  @keyframes messageSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .group:hover .group-hover\\:opacity-100 {
    animation: messageSlideIn 0.2s ease-out;
  }
`;

const ChatBotWrapper = () => {
  return (
    <>
      <style>{customStyles}</style>
      <WebsiteChatBot />
    </>
  );
};

export default ChatBotWrapper;