import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGlobe, FaBars, FaTimes } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const GuestHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [registerDropdown, setRegisterDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (document.getElementById("google-translate-script")) return;

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,mr,hi",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_inline"
      );
    };

    addGoogleTranslateScript();
  }, []);

  const handleRegisterRole = (role) => {
    if (role === "farmer") navigate("/register");
    else if (role === "vendor") navigate("/vendor-register");
    else if (role === "buyer") navigate("/buyer-register");

    setRegisterDropdown(false);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Header Section */}
      <header className="w-full bg-emerald-700 text-white shadow-md">
        <div className="w-full px-4 py-3 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold">🌾 Mazisheti</div>

          {/* Hamburger for mobile */}
          <div className="sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex gap-4 md:gap-6 items-center text-sm sm:text-base relative">
            <Link to="/" className="hover:text-yellow-300">Home</Link>
            <Link to="/about" className="hover:text-yellow-300">About Us</Link>
            <Link to="/login" className="hover:text-yellow-300">Login</Link>

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRegisterDropdown(!registerDropdown)}
                className="hover:text-yellow-300"
              >
                Register As ▾
              </button>
              {registerDropdown && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg z-50 w-40">
                  <button
                    onClick={() => handleRegisterRole("farmer")}
                    className="block w-full text-left px-4 py-2 hover:bg-emerald-100"
                  >
                    Farmer
                  </button>
                  <button
                    onClick={() => handleRegisterRole("vendor")}
                    className="block w-full text-left px-4 py-2 hover:bg-emerald-100"
                  >
                    Vendor
                  </button>
                  <button
                    onClick={() => handleRegisterRole("buyer")}
                    className="block w-full text-left px-4 py-2 hover:bg-emerald-100"
                  >
                    Buyer
                  </button>
                </div>
              )}
            </div>

            {/* Language */}
            <div className="relative">
              <button className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1 rounded">
                <FaGlobe />
              </button>
              <div
                id="google_translate_inline"
                className="absolute top-full right-0 mt-1 z-50"
              ></div>
            </div>
          </nav>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="sm:hidden bg-emerald-800 text-white px-4 py-3 space-y-2 text-sm">
            <Link to="/" className="block" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/about" className="block" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/login" className="block" onClick={() => setMenuOpen(false)}>Login</Link>

            <div>
              <p className="text-white font-semibold mt-2">Register As:</p>
              <button onClick={() => handleRegisterRole("farmer")} className="block w-full text-left px-2 py-1 hover:bg-emerald-600">Farmer</button>
              <button onClick={() => handleRegisterRole("vendor")} className="block w-full text-left px-2 py-1 hover:bg-emerald-600">Vendor</button>
              <button onClick={() => handleRegisterRole("buyer")} className="block w-full text-left px-2 py-1 hover:bg-emerald-600">Buyer</button>
            </div>

            {/* Mobile Translate */}
            <div className="relative">
              <button className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-1 rounded">
                <FaGlobe />
              </button>
              <div
                id="google_translate_inline"
                className="absolute top-full left-0 mt-1 z-50"
              ></div>
            </div>
          </div>
        )}

        {/* Marquee */}
        <div className="bg-yellow-100 text-green-900 py-2 overflow-hidden relative text-sm sm:text-base w-full">
          <div className="whitespace-nowrap animate-marquee font-medium px-4">
            🌿 Government Subsidy on Organic Fertilizers | 🚜 Free Soil Testing Camp - April 25 |
            💧 Irrigation Scheme Deadline: April 30 | 🌾 Crop Insurance Enrollment Open Till May 10
          </div>
        </div>
      </header>

      {/* Swiper on Homepage */}
      {isHomePage && (
        <div className="bg-white">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
          >
            {["Silder05.jpg", "Silder02.jpg", "Silder03.jpg"].map((src, i) => (
              <SwiperSlide key={i}>
                <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] relative">
                  <img
                    src={`/Images/${src}`}
                    alt={`Slide ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default GuestHeader;
