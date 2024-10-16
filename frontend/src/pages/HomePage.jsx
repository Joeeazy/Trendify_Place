import { useEffect } from "react";
import Banner from "../components/Banner";
import CategoryItem from "../components/CategoryItem";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";
import { useProductStore } from "../stores/useProductStore";
import { motion } from "framer-motion";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];
function HomePage() {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div>
      {/* Banner Section */}
      <Banner />

      {/* Main Content */}
      <div className="relative max-w-screen-7xl text-white overflow-hidden">
        <div className="relative z-10  mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center">
            {/* Categories Section */}
            <div className="mt-16 w-full text-center mb-20">
              <motion.h1
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.3,
                }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-emerald-400 mb-6"
              >
                Explore Our Categories
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.8,
                }}
                className="text-xl text-gray-300 mb-8"
              >
                Discover the latest trends in eco-friendly fashion
              </motion.p>

              <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-end  justify-center gap-12 shadow-sm">
                {categories.map((category) => (
                  <CategoryItem category={category} key={category.name} />
                ))}
              </div>
            </div>

            {/* Featured Products Section */}
            {!isLoading && products.length > 0 && (
              <div className="mt-20 w-full">
                <FeaturedProducts featuredProducts={products} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
