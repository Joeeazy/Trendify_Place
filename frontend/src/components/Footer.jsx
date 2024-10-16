import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import icons from "/payments.png";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* footer top */}
      <div className="max-w-screen-2xl container mx-auto xl:px-28 px-4">
        <div className="mt-20 mb-10 flex flex-col md:flex-row items-start justify-between gap-8">
          {/* company info */}
          <div className="md:w-[400px]">
            <Link to="/">
              <img src="/icons" alt="" />
            </Link>
            <p className="my-8 text-Black/75">
              Thank you for shopping at Trendify! We’re committed to providing
              you with the best products and exceptional customer service.
            </p>
            <div className="flex items-center gap-6">
              <FaFacebookF className="w-5 h-5 cursor-pointer hover:text-emerald-500" />
              <FaTwitter className="w-5 h-5 cursor-pointer hover:text-emerald-500" />
              <FaLinkedinIn className="w-5 h-5 cursor-pointer hover:text-emerald-500" />
              <FaInstagramSquare className="w-5 h-5 cursor-pointer hover:text-emerald-500" />
            </div>
          </div>

          {/* Catalog */}
          <div className="text-Black">
            <h4 className="font-semibold mb-3">CATALOG</h4>
            <div className="space-y-2">
              <Link
                to="/category/jeans"
                className="text-sm block hover:text-emerald-500"
              >
                Jeans
              </Link>
              <Link to="/" className="text-sm block hover:text-emerald-500">
                Shoes
              </Link>
              <Link
                to="/category/t-shirts"
                className="text-sm block hover:text-emerald-500"
              >
                T-shirts
              </Link>
              <Link
                to="/category/bags"
                className="text-sm block hover:text-emerald-500"
              >
                Bags
              </Link>
              <Link
                to="/category/glasses"
                className="text-sm block hover:text-emerald-500"
              >
                Glasses
              </Link>
            </div>
          </div>

          {/* CUSTOMER SERVICES */}
          <div className="text-Black">
            <h4 className="font-semibold mb-3">CUSTOMER SERVICES</h4>
            <div className="space-y-2">
              <Link to="/" className="text-sm block hover:text-emerald-500">
                Contact Us
              </Link>
              <Link to="/" className="text-sm block hover:text-emerald-500">
                Track Your Order
              </Link>
              <Link to="/" className="text-sm block hover:text-emerald-500">
                Product Care & Repair
              </Link>
              <Link to="/" className="text-sm block hover:text-emerald-500">
                Book an Appointment
              </Link>
              <Link to="/" className="text-sm block hover:text-emerald-500">
                Shipping & Returns
              </Link>
            </div>
          </div>

          {/* ABOUT US */}
          <div className="text-Black">
            <h4 className="font-semibold mb-3">ABOUT US</h4>
            <div className="space-y-2">
              <Link to="/" className="text-sm block hover:text-emerald-500">
                Our Producers
              </Link>
              <Link to="/" className="text-sm block hover:text-emerald-500">
                Sitemap
              </Link>
              <Link to="/" className="text-sm block hover:text-emerald-500">
                FAQ
              </Link>
              <Link to="/" className="text-sm block hover:text-emerald-500">
                About Us
              </Link>
              <Link to="/" className="text-sm block hover:text-emerald-500">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* footer bottom */}
      <div class="bg-emerald-800 flex flex-col items-center justify-center sm:flex-row sm:justify-between">
        <p class="text-white text-center py-3 mt-3 mb-3">
          © {currentYear} Trendify, Inc.
        </p>
        <div class="my-5  mt-3 mb-3 sm:my-0 sm:mr-2">
          <img src={icons} alt="" />
        </div>
        <div class="flex items-center text-white mr-10 mt-3 mb-3">
          <p class="mr-2">Scroll to Top</p>
          <FaArrowUp class="hidden sm:block mr-20" />
        </div>
      </div>
    </footer>
  );
}
