'use client';

import React, { useState } from 'react';
import api from '../../lib/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post(`/contact`, {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] w-full font-sans py-16 px-6 sm:px-12 lg:px-20 text-[#222222]">
      
      {/* Central Header Section */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <p className="text-sm font-semibold tracking-wide text-black mb-2">Have any queries?</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black">
          We're here to help.
        </h1>
        <div className="w-12 h-[1px] bg-gray-400 mx-auto mt-5"></div>
      </div>

      {/* Main Container - Width Increased to max-w-7xl */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Side Content & Details - Forced strict left-alignment on layout */}
        <div className="lg:col-span-5 space-y-6 pt-4 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
          <div className="space-y-2 w-full">
            <p className="text-xs font-bold text-black tracking-normal">Don't be a stranger!</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight">
              You tell us. We listen.
            </h2>
          </div>

          <div className="text-sm text-gray-700 space-y-4 leading-relaxed font-normal max-w-md w-full">
            <p>Have questions about printers, orders, shipping, or product compatibility?</p>
            <p>Our team is here to assist you with reliable customer guidance and support. Whether you need help choosing the right printer or assistance with your order, feel free to contact us.</p>
          </div>

          {/* Contact Directory - Fixed trailing spaces by keeping text alignment structured */}
          <div className="space-y-5 pt-2 text-sm text-gray-800 text-left w-full max-w-md">
            {/* Address Row */}
            <div className="w-full">
              <div className="text-gray-900 font-medium flex items-center justify-center lg:justify-start gap-1.5">
                <span className="text-red-500">📍</span> Address
              </div>
              <div className="mt-1 text-gray-600 leading-relaxed font-normal text-center lg:text-left">
                Smart Quick Assist<br />
                440 Davis Court, Apt 1516<br />
                San Francisco, CA 94111, United States
              </div>
            </div>

            {/* Email Row */}
            <div className="w-full">
              <div className="text-gray-900 font-medium flex items-center justify-center lg:justify-start gap-1.5">
                <span className="text-gray-500 text-xs">✉️</span> Email Support
              </div>
              <div className="mt-1 text-gray-600 font-normal text-center lg:text-left">
                support@smartquickassist.com
              </div>
            </div>

            {/* Website Row */}
            <div className="w-full">
              <div className="text-gray-900 font-medium flex items-center justify-center lg:justify-start gap-1.5">
                <span className="text-blue-500">🌐</span> Website
              </div>
              <div className="mt-1 text-gray-600 font-normal text-center lg:text-left">
                www.smartquickassist.com
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Half Section Form Block - Comfortably scaled layout width */}
        <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-sm shadow-[0_2px_15px_rgba(0,0,0,0.015)] border border-gray-100/80 w-full">
          
          {success && (
            <div className="mb-4 text-sm text-green-600 font-medium">
              ✓ Message sent successfully!
            </div>
          )}
          {error && (
            <div className="mb-4 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name input */}
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="NAME *"
                className="w-full px-4 py-3.5 bg-[#fdfdfd] border border-gray-200 text-xs text-gray-800 tracking-wider rounded focus:outline-none focus:border-gray-400 placeholder-gray-400 font-medium"
              />
            </div>

            {/* Subject input */}
            <div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="SUBJECT *"
                className="w-full px-4 py-3.5 bg-[#fdfdfd] border border-gray-200 text-xs text-gray-800 tracking-wider rounded focus:outline-none focus:border-gray-400 placeholder-gray-400 font-medium"
              />
            </div>

            {/* Email input */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="EMAIL *"
                className="w-full px-4 py-3.5 bg-[#fdfdfd] border border-gray-200 text-xs text-gray-800 tracking-wider rounded focus:outline-none focus:border-gray-400 placeholder-gray-400 font-medium"
              />
            </div>

            {/* Message input */}
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="MESSAGE"
                className="w-full px-4 py-3.5 bg-[#fdfdfd] border border-gray-200 text-xs text-gray-800 tracking-wider rounded focus:outline-none focus:border-gray-400 placeholder-gray-400 font-medium resize-none"
              ></textarea>
            </div>

            {/* Action Submit Button */}
            <div className="text-left pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#007cc4] hover:bg-[#006ba8] text-white font-bold text-xs tracking-wider uppercase px-6 py-3.5 rounded transition-colors duration-150 disabled:opacity-50"
              >
                {loading ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactForm;