import React from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./App.css";
import Hero from "./components/Hero/Hero";
import Companies from "./components/Companies/Companies";
import Value from "./components/Value/Value";
import Contact from "./components/Contact/Contact";
import Residencies from "./components/Residencies/Residencies";
// import Properties from "./components/Properties/Properties";
// import Context from "./components/Context/Context";

const App = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Companies />
      <Value />
      <Residencies/>
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
