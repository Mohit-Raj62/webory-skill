import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footers/Footer.jsx";
import Navigation from "./components/Navbar/Navigation";
import Home from "./components/Hero/Home.jsx";
import Aboutt from "./components/About/Aboutt.jsx";
import Mypro from "./components/Mywork/Mypro.jsx";
import Services from "./components/Serviece/Services.jsx";
import Contactt from "./components/Contacts/Contactt.jsx";
import WebsiteChatBot from "./components/ChatBot/WebsiteChatBot.jsx";
import TermsOfService from "./components/Terms/TermsOfService";
import PrivacyPolicy from "./components/Privacy/PrivacyPolicy";
// import Chat from './components/ChatBot/WebsiteChatBot.jsx';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black-50 font-sans items-center justify-center overflow-x-hidden">
        {/* Fixed navigation */}
        <div className="fixed top-0 z-10 w-full">
          <Navigation />
        </div>
        <WebsiteChatBot />

        <Routes>
          {/* Terms and Privacy Routes */}
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Main Route */}
          <Route
            path="/"
            element={
              <main className="w-full">
                <br />
                <section
                  id="home"
                  className="min-h-screen w-full flex items-center justify-center"
                >
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Home />
                  </div>
                </section>

                <section
                  id="about"
                  className="py-12 md:py-16 lg:py-20 w-full bg-black-100"
                >
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Aboutt />
                  </div>
                </section>

                <br />
                <br />

                <section
                  id="services"
                  className="py-12 md:py-16 lg:py-20 w-full bg-black-100"
                >
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Services />
                  </div>
                </section>

                <br />
                <br />
                <section
                  id="portfolio"
                  className="py-12 md:py-16 lg:py-20 w-full bg-black-100"
                >
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Mypro />
                  </div>
                </section>

                <section
                  id="contact"
                  className="py-12 md:py-16 lg:py-20 w-full bg-black-100"
                >
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Contactt />
                  </div>
                </section>
              </main>
            }
          />
        </Routes>

        {/* Footer */}
        <footer className="w-full bg-black-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Footer />
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
