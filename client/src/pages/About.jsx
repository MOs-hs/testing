import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { KhadamatiLogo } from '../components/KhadamatiLogo';
import SEO from '../components/SEO';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEO
        title="About Us - Khadamati | Learn About Our Home Services Platform"
        description="Learn about Khadamati's mission to connect customers with trusted home service providers in Baalbek-Hermel. Our vision, mission, and values."
        keywords="about khadamati, home services platform, our mission, our vision, Baalbek services, Hermel services"
      />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <KhadamatiLogo className="h-24 w-24 mx-auto mb-6" />
          <h1 className="text-5xl font-bold dark:text-white mb-4">About Us</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">khadamati.com</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold dark:text-white">Our Vision</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We aim to simplify daily home maintenance by providing a secure, modern, and efficient platform where users can request reliable home services, track progress, pay securely, and leave feedback.
          </p>

          <h2 className="text-3xl font-bold dark:text-white mt-8">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            To connect customers with professional and trusted service providers, ensuring a smooth and secure experience for all parties.
          </p>

          <h2 className="text-3xl font-bold dark:text-white mt-8">Our Values</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Reliability and Quality</li>
            <li>Transparency and Security</li>
            <li>Customer Satisfaction</li>
            <li>Innovation and Continuous Development</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
