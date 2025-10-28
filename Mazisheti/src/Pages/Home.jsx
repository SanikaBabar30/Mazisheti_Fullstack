import React from 'react';

const Home = () => {
  return (
    <section className="py-10 px-4 text-center bg-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-700 leading-tight">
        Know Your Crops Better with Mazisheti
      </h2>

      <p className="mt-4 text-gray-700 text-sm sm:text-base max-w-lg mx-auto px-2">
        Mazisheti helps farmers plan and grow better by providing crop-wise schedules,
        seasonal guides, and agricultural updates. Whether you're growing fruits or grains,
        you’ll find trusted information, government recommendations, and best practices
        all in one place — in Marathi and English.
      </p>

      <div className="mt-6">
        <a
          href="/crops"
          className="inline-block bg-emerald-600 text-white px-6 py-2 text-sm sm:text-base rounded-md hover:bg-emerald-700 transition"
        >
          View Crop Information
        </a>
      </div>
    </section>
  );
};

export default Home;
