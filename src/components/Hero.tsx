import React from 'react';

const Hero = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Transform Your Ideas Into Reality
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create stunning designs and bring your vision to life with our powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700">
              Start Creating
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 