// import aboutimg from "../../assets/aboutimg.svg";
import gmail from "../../assets/gmail.svg";
import whatsapp from "../../assets/whatsapp.svg";
import loca from "../../assets/location.svg";
import { useState, useEffect, useRef } from 'react';

const Contactt = () => {
  // Add state to track submitted name
  const [submittedName, setSubmittedName] = useState("");
  const [showSubmittedName, setShowSubmittedName] = useState(false);
  
  // Add verification code states
  const [verificationCode, setVerificationCode] = useState("");
  const [otpValues, setOtpValues] = useState(['', '', '', '', '']);
  const [verificationError, setVerificationError] = useState(false);
  
  // Refs for OTP input fields
  const otpRefs = useRef([]);

  // Generate verification code on component mount
  useEffect(() => {
    generateVerificationCode();
    
    // Initialize refs array
    otpRefs.current = Array(5).fill(0).map((_, i) => otpRefs.current[i]);
  }, []);

  // Function to generate a random 5-digit verification code
  const generateVerificationCode = () => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    setVerificationCode(randomCode.toString());
    setOtpValues(['', '', '', '', '']);
    setVerificationError(false);
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(0, 1); // Only take the first character
    setOtpValues(newOtpValues);
    
    // Auto focus on next input after entering a digit
    if (value && index < otpValues.length - 1) {
      otpRefs.current[index + 1].focus();
    }
    
    // Clear verification error if any
    if (verificationError) {
      setVerificationError(false);
    }
  };
  
  // Handle backspace key in OTP inputs
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        // If current input is empty and backspace is pressed, move to previous input
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = '';
        setOtpValues(newOtpValues);
        otpRefs.current[index - 1].focus();
      }
    }
  };
  
  // Handle paste event for OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    
    // Check if pasted content is a number and has correct length
    if (/^\d+$/.test(pasteData) && pasteData.length <= otpValues.length) {
      const newOtpValues = [...otpValues];
      for (let i = 0; i < pasteData.length; i++) {
        newOtpValues[i] = pasteData[i];
      }
      setOtpValues(newOtpValues);
      
      // Focus on the next empty input or the last input
      const nextIndex = Math.min(pasteData.length, otpValues.length - 1);
      otpRefs.current[nextIndex].focus();
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    
    // Combine OTP values and verify
    const userInput = otpValues.join('');
    if (userInput !== verificationCode) {
      setVerificationError(true);
      return;
    }
    
    const formData = new FormData(event.target);

    // Get the name value to display
    const nameValue = formData.get("name");
    setSubmittedName(nameValue);
    setShowSubmittedName(true);

    formData.append("access_key", "d09fe9f8-a093-4660-ad6c-321fe653faa2");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());
    
    if (res.success) { 
      // Only show thank you message after successful submission
      alert("Thank you for your message, " + nameValue.toUpperCase() + "!");
      
      // Reset form and generate new verification code
      event.target.reset();
      generateVerificationCode();
    }
  };
  
  return (
    <div
      id="contact"
      className="contact flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-20 py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-8 lg:px-12 xl:px-20 max-w-screen-2xl mx-auto"
    >
      <div className="contact-title relative w-full text-center">
        <h1 className="px-2 sm:px-4 md:px-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold font-playfair">
          Get In Touch
        </h1>
        {/* <img
          src={aboutimg}
          alt="About"
          className="absolute -z-1 bottom-0 top-1 right-2 sm:right-4 md:right-0 rounded h-12 sm:h-16 md:h-20 border-radius-1"
        /> */}
      </div>

      {/* Display submitted name - Mobile optimized */}
      {showSubmittedName && (
        <div className="bg-gradient-to-r from-[#dd8908] to-[#b415ff] p-3 sm:p-4 rounded-lg text-white text-center w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
          <p className="text-base sm:text-lg md:text-xl font-medium">
            Thank you for your message, 
            <span className="font-bold text-neutral-50 block sm:inline"> {submittedName.toUpperCase()}</span>!
          </p>
          <p className="text-xs sm:text-sm mt-1 sm:mt-2">We&#39;ll get back to you soon.</p>
        </div>
      )}

      <div className="contact-section flex flex-col gap-8 sm:gap-10 md:gap-12 lg:flex-row lg:gap-16 xl:gap-24 w-full">
        <div className="contact-left flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8 w-full lg:w-2/5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-[#dd8908] to-[#b415ff] bg-clip-text text-transparent font-playfair text-center lg:text-left">
            Let&#39;s talk
          </h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8 font-montserrat text-center lg:text-left px-2 sm:px-0">
            I am currently available to take on new projects, so feel free to
            send me a message about anything that you want me to work on. You
            can also check out my resume and other projects.
          </p>
          <div className="contact-details flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8 text-gray-300 text-base sm:text-lg md:text-xl mt-2">
            <div className="contact-detail flex items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-5">
              <a href="https://whatsapp.com/channel/0029Vb3Cd5JFnSzHB0i0on04" className="contact-detail flex items-center gap-3 sm:gap-4 md:gap-5 hover:text-white transition-colors">
                <img
                  src={whatsapp}
                  alt="whatsapp"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <p className="break-all">WhatsApp</p>
              </a>
            </div>
            <div className="contact-detail flex items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-5">
              <a href="mailto:mohit9470sinha@gmail.com" className="contact-detail flex items-center gap-3 sm:gap-4 md:gap-5 hover:text-white transition-colors">
                <img
                  src={gmail}
                  alt="Email"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <p className="break-all">E-mail</p>
              </a>
            </div>
            <div className="contact-detail flex items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-5">
              <img
                src={loca}
                alt="Location"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <p>Patna, India, Bihar</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="contact-right flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8 w-full lg:w-3/5 xl:w-3/5"
        >
          <input
            type="text"
            placeholder="Enter your name"
            required
            name="name"
            className="border-none w-full h-12 sm:h-14 md:h-16 lg:h-[78px] pl-3 sm:pl-4 md:pl-5 rounded-lg bg-[#32323c] text-gray-400 font-outfit text-sm sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#b415ff] transition-all"
          />

          <input
            type="email"
            required
            placeholder="Enter your email"
            name="email"
            className="border-none w-full h-12 sm:h-14 md:h-16 lg:h-[78px] pl-3 sm:pl-4 md:pl-5 rounded-lg bg-[#32323c] text-gray-400 font-outfit text-sm sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#b415ff] transition-all"
          />

          <textarea
            name="message"
            required
            rows="3"
            placeholder="Enter your message"
            className="w-full border-none p-3 sm:p-4 md:p-6 rounded-lg bg-[#32323c] text-gray-400 font-outfit text-sm sm:text-base md:text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#b415ff] transition-all"
          />
          
          {/* Verification code display and OTP Input boxes - Mobile optimized */}
          <div className="verification-section">
            <div className="verification-heading flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mb-4">
              <div className="verification-code-display px-3 sm:px-4 py-2 rounded-lg bg-[#32323c] order-2 sm:order-1">
                <span className="font-bold text-white text-base sm:text-lg md:text-xl tracking-wider select-none">
                  {verificationCode}
                </span>
              </div>
              
              <button
                type="button"
                onClick={generateVerificationCode}
                className="text-gray-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-[#404050] transition-colors text-xs sm:text-sm md:text-base order-3 sm:order-2"
              >
                New Code
              </button>
            </div>
          
            {/* OTP Input Boxes - Mobile optimized */}
            <div className="otp-input-container flex justify-center gap-1 sm:gap-2 md:gap-4 mb-3">
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  ref={(el) => (otpRefs.current[index] = el)}
                  maxLength="1"
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-center text-lg sm:text-xl md:text-2xl font-bold rounded-lg bg-[#32323c] text-gray-100 border-2 border-gray-600 focus:border-[#b415ff] focus:outline-none transition-all"
                />
              ))}
            </div>
            
            {verificationError && (
              <p className="text-red-500 text-xs sm:text-sm mt-2 text-center">Code doesn&#39;t match. Please try again.</p>
            )}
          </div>
          
          <button
            type="submit"
            className="contact-submit border-none h-15 py-3 px-6 sm:py-4 sm:px-10 md:py-5 md:px-14 text-white text-lg sm:text-4xl rounded-full bg-gradient-to-r from-[#df8908] to-[#b415ff] cursor-pointer font-montserrat transition duration-300 mb-12 hover:scale-105"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contactt;







