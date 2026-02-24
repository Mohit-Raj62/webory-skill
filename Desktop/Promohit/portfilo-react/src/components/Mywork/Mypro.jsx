import aboutimg from "../../assets/aboutimg.svg";
import mywork_data from '../../assets/mywork_data.js';
// import arrow from "../../assets/arrow.svg";

const Mypro = () => {
  return (
    <div 
      id='mywork' 
      className='flex flex-col items-center justify-center gap-16 md:gap-20 py-16 md:py-20 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-44 bg-gradient-to-br '
    >
      {/* Title Section */}
      <div className="relative mb-8">
        <h1 className="px-6 md:px-8 text-4xl sm:text-5xl md:text-6xl font-bold font-['Playfair_Display',serif] bg-gradient-to-r from-[#0056b3] via-[#ff03d9] to-[#0056b3] bg-clip-text text-transparent text-center">
          My Latest Work
        </h1>
        <img
          src={aboutimg}
          alt=""
          className="absolute -z-1 top-0 right-0 h-12 md:h-16 opacity-30"
        />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#0056b3] to-[#ff03d9] rounded-full"></div>
      </div>

      {/* Subtitle */}
      <div className="text-center max-w-3xl mb-8">
        <p className="text-lg sm:text-xl md:text-2xl text-white font-['Montserrat',sans-serif] leading-relaxed">
          Explore my portfolio of innovative projects that showcase modern web development, 
          creative design solutions, and cutting-edge technologies.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {mywork_data.map((Work, index) => {
            return (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white"
              >
                {/* Project Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={Work.w_img}
                    alt={`Project ${index + 1}`}
                    className="w-full h-[280px] sm:h-[320px] object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Project Number Badge */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-r from-[#0056b3] to-[#ff03d9] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>

                  {/* Hover Content */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-center text-white p-6">
                      <h3 className="text-xl font-bold mb-2">Project {index + 1}</h3>
                      <p className="text-sm mb-4">Click to view details</p>
                      <div className="flex gap-2 justify-center">
                        <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
                          View
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-[#0056b3] to-[#ff03d9] rounded-full text-sm font-medium hover:shadow-lg transition-shadow">
                          Demo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Info Bar */}
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-[#0056b3] to-[#ff03d9] rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-600">Latest Project</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-gradient-to-r from-[#0056b3] to-[#ff03d9] rounded-full opacity-70"></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-[#0056b3] group-hover:to-[#ff03d9] rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
       </div>

       {/* Enhanced Show More Button */}

      {/* Statistics Section */}
      <div className="w-full max-w-4xl mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "25+", label: "Projects" },
            { number: "15+", label: "Clients" },
            { number: "3+", label: "Years" },
            { number: "100%", label: "Success" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl md:text-4xl font-bold font-['Playfair_Display',serif] bg-gradient-to-r from-[#0056b3] to-[#ff03d9] bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center max-w-2xl mt-12 p-8 bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl shadow-inner">
        <h3 className="text-2xl md:text-3xl font-bold font-['Playfair_Display',serif] mb-4 bg-gradient-to-r from-[#0056b3] to-[#ff03d9] bg-clip-text text-transparent">
          Ready to Start Your Project?
        </h3>
        <p className="text-gray-600 mb-6 font-['Montserrat',sans-serif]">
          Let&#39;s collaborate to bring your ideas to life with innovative solutions and modern technologies.
        </p>
        {/* <button className="bg-gradient-to-r from-[#ff03d9] to-[#0056b3] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          Get In Touch
        </button> */}
      </div>
    </div>
  );
};

export default Mypro;