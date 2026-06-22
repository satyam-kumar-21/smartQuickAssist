import React from "react";
import AboutHero from "./AboutHero";
import WhyChooseAbout from "./WhyChooseAbout";
import AboutUs from "./AboutUs";
import WhatWeOffer from "./WhatWeOffer";

const AboutMain = () => {
  return (
    <>
      {/* Fixed Background for About Route */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: 'url(/about-banner-fixed.png)' }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="relative z-0">
        <AboutHero />
        <AboutUs />
      </div>
      <WhatWeOffer />
      <WhyChooseAbout />
    </>
  );
};

export default AboutMain;
