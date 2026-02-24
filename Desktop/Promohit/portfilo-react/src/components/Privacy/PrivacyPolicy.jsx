// import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col justify-center items-center">
      
      {/* Header Section with Gradient Overlay */}
      <div className="bg-gradient-to-b from-amber-500/10 to-transparent w-full">
        <div className="container mx-auto px-4 pt-20">
          <h1 className="text-3xl md:text-5xl font-bold text-center text-amber-500 mb-4">
            Privacy Policy
          </h1>
          <div className="w-32 h-1 mx-auto bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-8"></div>
          <p className="text-gray-300 text-center max-w-2xl mx-auto text-sm sm:text-base">
           Privacy Policy & Conditions. 
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-700/50">
      <h1 className="text-2xl sm:text-3xl text-center justify-center font-bold mb-4 text-amber-400 flex items-center"> PRIVACY POLICY </h1>

          <div className="space-y-8">
            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  1
                </span>
                Information Collection
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                We collect information that you voluntarily provide when
                contacting us through forms or email. This may include your
                name, email address, and any other information you choose to
                provide.
              </p>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  2
                </span>
                Use of Information
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                The information we collect is used to:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-2 sm:ml-4 mt-2 space-y-1 sm:space-y-2">
                <li>Respond to your inquiries and communication</li>
                <li>Improve our website and services</li>
                <li>
                  Send periodic emails (if you&apos;ve agreed to receive them)
                </li>
              </ul>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  3
                </span>
                Data Protection
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                We implement appropriate data collection, storage, and
                processing practices and security measures to protect against
                unauthorized access, alteration, disclosure, or destruction of
                your personal information.
              </p>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  4
                </span>
                Cookies and Tracking
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                This website may use cookies to enhance user experience. Cookies
                are small pieces of data stored on your device. You can choose
                to disable cookies through your browser settings.
              </p>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  5
                </span>
                Third-Party Websites
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                This website may contain links to external sites. We are not
                responsible for the content or privacy practices of these sites.
                We encourage users to read the privacy policies of any external
                sites they visit.
              </p>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  6
                </span>
                Your Rights
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-2 sm:ml-4 mt-2 space-y-1 sm:space-y-2">
                <li>Access your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
              </ul>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  7
                </span>
                Changes to Privacy Policy
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                We reserve the right to update or change our Privacy Policy at
                any time. Any changes will be posted on this page with an
                updated revision date.
              </p>
            </section>

            <section className="hover:bg-gray-700/50 p-6 rounded-xl transition-all duration-300 border border-gray-700/30">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-amber-400 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mr-3 text-amber-500">
                  8
                </span>
                Contact Information
              </h2>
              <p className="text-gray-300 leading-relaxed pl-11">
                If you have any questions about this Privacy Policy, please
                contact us through the contact information provided on our
                website.
              </p>
            </section>
          </div>

          {/* Back Button with improved styling */}
          <div className="text-center mt-12">
            <Link
              to="/"
              className="inline-flex h-10 w-20 items-center px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/20 gap-2 text-sm sm:text-base"
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

export default PrivacyPolicy;
