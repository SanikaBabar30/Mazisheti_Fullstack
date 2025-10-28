// AboutUs.js
import React from "react";
import { FaLeaf, FaStore, FaShoppingCart } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6 md:px-20">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
        About MaziSheti
      </h1>
      <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12">
        MaziSheti bridges the gap between farmers, vendors, and buyers by
        providing dynamic crop schedules, efficient product management, and
        seamless market access. Our mission is to empower the agricultural
        community and make farming smarter and profitable.
      </p>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Farmers Section */}
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center hover:scale-105 transition-transform">
          <div className="text-green-600 text-5xl mb-4 flex justify-center">
            <FaLeaf />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Farmers</h2>
          <p className="text-gray-600">
            Get "dynamic crop schedules" tailored to your crops and start
            dates. Receive daily reminders and guidance from planting to
            harvest, maximizing yield and efficiency.
          </p>
        </div>

        {/* Vendors Section */}
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center hover:scale-105 transition-transform">
          <div className="text-yellow-500 text-5xl mb-4 flex justify-center">
            <FaStore />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Vendors</h2>
          <p className="text-gray-600">
            Showcase and manage your agricultural products, seeds, and farming
            inputs. Connect with farmers and buyers to expand your reach and
            boost sales.
          </p>
        </div>

        {/* Buyers Section */}
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center hover:scale-105 transition-transform">
          <div className="text-blue-500 text-5xl mb-4 flex justify-center">
            <FaShoppingCart />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Buyers</h2>
          <p className="text-gray-600">
            Discover and purchase high-quality agricultural products from
            trusted vendors. Enjoy a seamless shopping experience with verified
            products and competitive pricing.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Join MaziSheti Today
        </h2>
        <p className="text-gray-700 max-w-xl mx-auto">
          Where innovation meets agriculture. Connect, grow, and thrive in our
          agricultural community.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
