// AboutAndContactComp.jsx
import React from 'react';
import { ContactSection } from '../contact';
import AboutSection from '../../includes/about';
import ProfileList from '../../includes/about/Tentang';

const AboutAndContactComp = () => {
  return (
    <div>
      <AboutSection />
      <ProfileList/>
      <ContactSection />
    </div>
  );
};

export default AboutAndContactComp;