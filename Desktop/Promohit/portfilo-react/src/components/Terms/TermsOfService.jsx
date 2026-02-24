// import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col justify-center items-center">
      {/* Header Section with Gradient Overlay */}
      <div className="bg-gradient-to-b from-amber-500/10 to-transparent w-full">
        <div className="container mx-auto px-4 pt-20">
          <h1 className="text-3xl md:text-5xl font-bold text-center text-amber-500 mb-4">
            Terms of Service
          </h1>
          <div className="w-32 h-1 mx-auto bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-8"></div>
          <p className="text-gray-300 justify-center text-center max-w-2xl mx-auto text-sm sm:text-base">
            Terms of Service & Conditions 
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-700/50">
        <h1 className="text-2xl sm:text-3xl text-center justify-center font-bold mb-4 text-amber-400 flex items-center"> TERMS OF SERVICE </h1>
          <div className="space-y-8">
            {/* Sections with improved styling */}
            
            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center"> 
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  1
                </span>
                Acceptance of Terms
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                By accessing and using this website, you accept and agree to be
                bound by the terms and provisions of this agreement.
              </p>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  2
                </span>
                Use License
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                Permission is granted to temporarily view the materials
                (information or software) on Mohit Sinha&#39;s website for
                personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  3
                </span>
                Disclaimer
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                The materials on this website are provided on an &#39;as is&#39;
                basis. Mohit Sinha makes no warranties, expressed or implied,
                and hereby disclaims and negates all other warranties including,
                without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </p>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  4
                </span>
                Limitations
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                In no event shall Mohit Sinha or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on this website.
              </p>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  5
                </span>
                Revisions
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                The materials appearing on this website could include technical,
                typographical, or photographic errors. Mohit Sinha does not
                warrant that any of the materials on its website are accurate,
                complete, or current.
              </p>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  6
                </span>
                Links
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                Mohit Sinha has not reviewed all of the sites linked to its
                website and is not responsible for the contents of any such
                linked site. The inclusion of any link does not imply
                endorsement by Mohit Sinha of the site.
              </p>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  7
                </span>
                Modifications
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                Mohit Sinha may revise these terms of service for its website at
                any time without notice. By using this website, you are agreeing
                to be bound by the then current version of these terms of
                service.
              </p>
            </section>
          </div>

          {/* Back Button with improved styling */}
          <div className="text-center mt-12">
            <Link
              to="/"
              className="inline-flex items-center h-10 w-20 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/20 gap-2 text-sm sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back 
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
