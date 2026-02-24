import aboutimg from "../../assets/aboutimg.svg";
import vscode from "../../assets/about-removebg.png";

const Aboutt = () => {
  return (
    <div
      id="about"
      className="flex flex-col items-center justify-center gap-12 md:gap-20 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-44 py-16 md:py-20"
    >
      {/* About Title Section */}
      <div className="relative">
        <h1 className="px-6 md:px-8 text-4xl sm:text-5xl md:text-6xl font-semibold font-['Playfair_Display',serif]">
          About Me
        </h1>
        <img
          src={aboutimg}
          alt=""
          className="absolute top-0 bottom-0 right-0 -z-1 border-radius-1"
        />
      </div>

      {/* About Sections */}
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-20 w-full">
        {/* Left Column - Image */}
        <div className="about-right lg:w-2/5">
          <img className="about-img rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-300" src={vscode} alt="" />
        </div>
        
        {/* Right Column - Content */}
        <div className="about-right flex flex-col gap-12 md:gap-20 w-full lg:w-2/4">
          {/* About Paragraphs */}
          <div className="about-para flex flex-col gap-5 text-base sm:text-lg md:text-xl font-medium font-['Montserrat',serif]">
            <p>
              I&#39;m an experienced Full Stack Developer with over 3 years of
              professional expertise in modern web development. Throughout my career, I have
              had the privilege of collaborating with prestigious organizations,
              contributing to their success and growth.
            </p>
            <p>
              My passion for web development is not only reflected in my
              extensive experience but also in the enthusiasm and dedication I
              bring to each project, staying current with the latest technologies and best practices.
            </p>
          </div>

          {/* Skills Section */}
          <div className="about-skills flex flex-col gap-8">
            {/* Frontend Skills */}
            <div className="skills-category">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#e3df03] to-[#00e1fe] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Playfair_Display',serif] bg-gradient-to-r from-[#e3df03] to-[#00e1fe] bg-clip-text text-transparent">
                  Frontend Technologies
                </h1>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    HTML
                  </p>
                  <div className="flex-1 rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[90%] bg-gradient-to-r from-[#e3df03] to-[#00e1fe] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">90%</span>
                </div>

                <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    CSS
                  </p>
                  <div className="flex-1 rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-[#e3df03] to-[#00e1fe] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">85%</span>
                </div>

                <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    JavaScript ES6+
                  </p>
                  <div className="flex-1  rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[80%] bg-gradient-to-r from-[#e3df03] to-[#00e1fe] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">80%</span>
                </div>

                <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    React.js
                  </p>
                  <div className="flex-1  rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-[#e3df03] to-[#00e1fe] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">85%</span>
                </div>

                <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    Next.js
                  </p>
                  <div className="flex-1  rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[75%] bg-gradient-to-r from-[#e3df03] to-[#00e1fe] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">75%</span>
                </div>

                {/* <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    TypeScript
                  </p>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[70%] bg-gradient-to-r from-[#e3df03] to-[#00e1fe] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">70%</span>
                </div> */}

                <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    Tailwind CSS
                  </p>
                  <div className="flex-1  rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-[#e3df03] to-[#00e1fe] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">85%</span>
                </div>

                <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    Vue.js
                  </p>
                  <div className="flex-1  rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-[#e3df03] to-[#00e1fe] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">65%</span>
                </div>
              </div>
            </div>

            {/* Backend Skills */}
            <div className="skills-category mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#00e1fe] to-[#e3df03] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Playfair_Display',serif] bg-gradient-to-r from-[#00e1fe] to-[#e3df03] bg-clip-text text-transparent">
                  Backend Technologies
                </h1>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    Node.js
                  </p>
                  <div className="flex-1  rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[80%] bg-gradient-to-r from-[#00e1fe] to-[#e3df03] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">80%</span>
                </div>

                <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    Express.js
                  </p>
                  <div className="flex-1  rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[75%] bg-gradient-to-r from-[#00e1fe] to-[#e3df03] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">75%</span>
                </div>

                <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    MongoDB
                  </p>
                  <div className="flex-1  rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[70%] bg-gradient-to-r from-[#00e1fe] to-[#e3df03] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">70%</span>
                </div>

                {/* <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    PostgreSQL
                  </p>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-[#00e1fe] to-[#e3df03] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">65%</span>
                </div> */}

                <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    Python Django
                  </p>
                  <div className="flex-1  rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[60%] bg-gradient-to-r from-[#00e1fe] to-[#e3df03] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">60%</span>
                </div>

                <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    Firebase
                  </p>
                  <div className="flex-1  rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[75%] bg-gradient-to-r from-[#00e1fe] to-[#e3df03] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">75%</span>
                </div>

                {/* <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    RESTful APIs
                  </p>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-[#00e1fe] to-[#e3df03] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">85%</span>
                </div> */}

                {/* <div className="about-skill flex gap-4 sm:gap-8 md:gap-12 items-center hover:scale-105 transition-all duration-300 p-2 rounded-lg hover">
                  <p className="min-w-[120px] sm:min-w-[150px] text-lg sm:text-xl md:text-2xl font-semibold">
                    GraphQL
                  </p>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div className="h-full w-[55%] bg-gradient-to-r from-[#00e1fe] to-[#e3df03] rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">55%</span>
                </div> */}
              </div>
            </div>

            {/* Tools & Others */}
            <div className="skills-category mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#e3df03] via-[#00e1fe] to-[#e3df03] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Playfair_Display',serif] bg-gradient-to-r from-[#e3df03] via-[#00e1fe] to-[#e3df03] bg-clip-text text-transparent">
                  Tools & Technologies
                </h1>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Git & GitHub",
                  "Docker",
                  "AWS Services",
                  "Webpack",
                  "Jest Testing",
                  "Figma",
                  "VS Code",
                  "Postman",
                  "Linux/Unix"
                ].map((tool, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="w-3 h-3 bg-gradient-to-r from-[#e3df03] to-[#00e1fe] rounded-full"></div>
                    <span className="font-medium text-gray-700">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="about-achievements flex w-full justify-around flex-wrap gap-6 md:gap-0 mb-10 sm:mb-12 md:mb-16">
        <div className="about-achievement flex flex-col items-center gap-2 md:gap-3 hover:scale-110 transition-transform duration-500 p-6 rounded-xl bg-gradient-to-br  to-white shadow-lg hover:shadow-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Playfair_Display',serif] bg-gradient-to-r from-[#e3df03] to-[#00e1fe] bg-clip-text text-transparent">
            3+
          </h1>
          <p className="font-semibold text-base sm:text-lg md:text-xl font-['Playfair_Display',serif] text-center text-gray-700">
            YEARS OF EXPERIENCE
          </p>
        </div>

        <hr className="hidden md:block h-32 w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent" />

        <div className="about-achievement flex flex-col items-center gap-2 md:gap-3 hover:scale-110 transition-transform duration-500 p-6 rounded-xl bg-gradient-to-br to-white shadow-lg hover:shadow-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Playfair_Display',serif] bg-gradient-to-r from-[#e3df03] to-[#00e1fe] bg-clip-text text-transparent">
            25+
          </h1>
          <p className="font-semibold text-base sm:text-lg md:text-xl font-['Playfair_Display',serif] text-center text-gray-700">
            PROJECTS COMPLETED
          </p>
        </div>

        <hr className="hidden md:block h-32 w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent" />

        <div className="about-achievement flex flex-col items-center gap-2 md:gap-3 hover:scale-110 transition-transform duration-500 p-6 rounded-xl bg-gradient-to-br to-white shadow-lg hover:shadow-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Playfair_Display',serif] bg-gradient-to-r from-[#e3df03] to-[#00e1fe] bg-clip-text text-transparent">
            15+
          </h1>
          <p className="font-semibold text-base sm:text-lg md:text-xl font-['Playfair_Display',serif] text-center text-gray-700">
            HAPPY CLIENTS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Aboutt;