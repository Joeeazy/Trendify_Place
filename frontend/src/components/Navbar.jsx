import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Lock,
  CarTaxiFront,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

function Navbar() {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === "admin";

  const navItems = [
    { title: "Jeans", path: "/category/jeans" },
    { title: "T-shirts", path: "/category/t-shirts" },
    { title: "Shoes", path: "/category/shoes" },
    { title: "Glasses", path: "/category/glasses" },
    { title: "Jackets", path: "/category/jackets" },
    { title: "Suits", path: "/category/suits" },
    { title: "Bags", path: "/category/bags" },
  ];

  return (
    <header className="fixed top-0 left-0 px-4 py-3 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md  z-40 transition-all duration-300 ">
      <div className="container mx-auto  shadow-lg border-b border-emerald-800">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold  text-emerald-400 tracking-tight items-center space-x-2 flex"
          >
            Trendify E-commerce
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={"/"}
              className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>
            {user && (
              <Link to={"/cart"} className="relative group">
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-400"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span
                    className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
                  >
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
              transition duration-300 ease-in-out flex items-center"
                to={"/secret-dashboard"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out"
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
      <div className="pt-4">
        <ul className="lg:flex items-center justify-between text-white hidden">
          {navItems.map(
            (
              { title, path },
              index // Corrected destructuring
            ) => (
              <li key={index} className="hover:text-emerald-500">
                <Link to={path}>{title}</Link>{" "}
                {/* Changed anchor tag to Link */}
              </li>
            )
          )}
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
