import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function FeaturedProducts({ featuredProducts }) {
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [itemsPerPage, setItemsPerPage] = useState(4);

  const { addToCart } = useCartStore();

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 640) setItemsPerPage(1);
  //     else if (window.innerWidth < 1024) setItemsPerPage(2);
  //     else if (window.innerWidth < 1280) setItemsPerPage(3);
  //     else setItemsPerPage(4);
  //   };

  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // const nextSlide = () => {
  //   setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  // };

  // const prevSlide = () => {
  //   setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  // };

  // const isStartDisabled = currentIndex === 0;
  // const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-8">
          Featured Products
        </h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              // style={{
              //   transform: `translateX(-${
              //     currentIndex * (100 / itemsPerPage)
              //   }%)`,
              // }}
            >
              <Swiper
                slidesPerView={1}
                spaceBetween={10}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 50,
                  },
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
              >
                {featuredProducts?.map((product) => (
                  <SwiperSlide key={product._id}>
                    <div className="">
                      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-[400px] transition-all duration-300 hover:shadow-xl border border-emerald-500/30">
                        <div className="overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-80 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2 text-white">
                            {product.name}
                          </h3>
                          <p className="text-emerald-300 font-medium mb-4">
                            ${product.price.toFixed(2)}
                          </p>
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center"
                          >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* <button
            onClick={prevSlide}
            disabled={isStartDisabled}
            className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-3 rounded-full transition-colors duration-300 ${
              isStartDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button> */}

          {/* <button
            onClick={nextSlide}
            disabled={isEndDisabled}
            className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-3 rounded-full transition-colors duration-300 ${
              isEndDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button> */}
        </div>
      </div>
    </div>
  );
}
