import React from "react";
import { Carousel } from "flowbite-react";
import nikes from "/Nike.webp";
import lady from "/lady.webp";
import { motion } from "framer-motion";
export default function Banner() {
  return (
    <div>
      {/* Use min-h-[75vh] to ensure the banner takes up enough height but doesn't stretch too far */}
      <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto min-h-[60vh] h-screen flex items-center">
        <Carousel slideInterval={5000} className="w-full mx-auto">
          {/* Slide 1 */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 1.2,
              }}
              className="w-full md:w-1/2 text-center md:text-left"
            >
              <h1 className="text-4xl font-bold mb-4 text-neutralDGrey leading-snug">
                Discover the Latest Collections
                <br />
                <span className="text-brandPrimary">
                  Top Brands. Best Prices.
                </span>
              </h1>
              <p className="text-neutralDGrey text-lg mb-6">
                Shop from our wide range of eco-friendly products and enjoy
                special discounts this season.
              </p>
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
              >
                Shop Now 🛒
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 1.4,
              }}
              className="w-full md:w-1/2"
            >
              <img
                src={nikes}
                alt="Explore New Collections"
                className="w-full h-auto"
              />
            </motion.div>
          </div>

          {/* Slide 2 */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-1/2">
              <motion.img
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 1.2,
                }}
                src={lady}
                alt="Exclusive Offers"
                className="w-full h-auto"
              />
            </div>
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 1.4,
              }}
              className="w-full md:w-1/2 text-center md:text-left"
            >
              <h1 className="text-4xl font-bold mb-4 text-neutralDGrey leading-snug">
                Shop Exclusive Offers
                <br />
                <span className="text-brandPrimary">Limited Time Only</span>
              </h1>
              <p className="text-neutralDGrey text-lg mb-6">
                Upgrade your wardrobe with our hand-picked, sustainable fashion
                items at unbeatable prices.
              </p>
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
              >
                Explore categories
              </button>
            </motion.div>
          </div>
        </Carousel>
      </div>
    </div>
  );
}
