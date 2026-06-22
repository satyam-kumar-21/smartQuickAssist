import React from 'react';
import ContactHero from './ContactHero';
import ContactForm from './ContactForm';

function ContactMain() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section */}
      <ContactHero />

      {/* Main Content Area (Form, Maps, Info, etc. can go here) */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <ContactForm />
      </main>
    </div>
  );
}

export default ContactMain;