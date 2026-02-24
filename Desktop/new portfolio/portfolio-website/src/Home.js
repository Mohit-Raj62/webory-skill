// src/Home.js
import React, { useEffect, useRef } from 'react';

const Home = () => {
  const typingAnimationElement = useRef(null);
  const typingTexts = ['Software Developer', 'Freelancer Artist', 'Video Editor'];

  useEffect(() => {
    let currentTextIndex = 0;
    let currentCharIndex = 0;

    const typeText = () => {
      if (currentCharIndex < typingTexts[currentTextIndex].length) {
        typingAnimationElement.current.textContent += typingTexts[currentTextIndex][currentCharIndex];
        currentCharIndex++;
        setTimeout(typeText, 100); // Adjust typing speed here
      } else {
        setTimeout(() => {
          currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
          currentCharIndex = 0;
          typingAnimationElement.current.textContent = ''; // Clear text
          typeText(); // Start typing the next text
        }, 1000); // Pause before starting the next text
      }
    };

    typeText(); // Start the typing animation

    return () => {
      typingAnimationElement.current.textContent = ''; // Cleanup on unmount
    };
  }, []);

  return (
    <section id="home-section" className="hero">
      <div className="home-slider owl-carousel">
        <div className="slider-item">
          <div className="overlay"></div>
          <div className="container">
            <div className="row d-md-flex no-gutters slider-text align-items-end justify-content-end">
              <div className="one-forth d-flex align-items-center ftco-animate">
                <div className="text">
                  <span className="subheading">Hello!</span>
                  <h1 className="mb-4 mt-3">I'm <span>Mohit Sinha</span></h1>
                  <span ref={typingAnimationElement}></span>
                  <p>
                    <a href="https://www.instagram.com/anurag.sketches/" className="btn btn-primary py-3 px-4">My Instagram</a>
                    <a href="https://www.linkedin.com/in/anuragdevnath/" className="btn btn-white btn-outline-white py-3 px-4">My Linkedin</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
