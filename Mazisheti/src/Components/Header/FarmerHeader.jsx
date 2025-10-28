import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGlobe, FaBars, FaTimes } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const FarmerHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

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

  return (
    <>
      <header className="bg-emerald-700 text-white shadow-md">
        <div className="w-full px-4 py-3 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold">🌾 Mazisheti </div>

          {/* Hamburger Toggle */}
          <div className="sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex gap-6 items-center text-sm sm:text-base">
            <Link to="/" className="hover:text-yellow-300">Home</Link>
            <Link to="/crop" className="hover:text-yellow-300">View Crop Information</Link>
            <Link to="/saved-schedules" className="hover:text-yellow-300">View Saved Schedule</Link>
            <button onClick={handleLogout} className="hover:text-yellow-300">Logout</button>
            <div className="relative">
              <button className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1 rounded">
                <FaGlobe />
              </button>
              <div id="google_translate_inline" className="absolute top-full right-0 mt-1 z-50" />
            </div>
          </nav>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="sm:hidden bg-emerald-800 text-white px-4 py-3 space-y-3 text-base">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block">Home</Link>
            <Link to="/crop" onClick={() => setMenuOpen(false)} className="block">View Crop Information</Link>
            <Link to="/saved-schedules" onClick={() => setMenuOpen(false)} className="block">View Saved Schedule</Link>
            <button onClick={handleLogout} className="block text-left w-full">Logout</button>

            {/* Language Selector */}
            <div className="relative">
              <button className="flex items-center gap-1 bg-emerald-600 px-3 py-1 rounded">
                <FaGlobe />
                <span>Language</span>
              </button>
              <div id="google_translate_inline" className="mt-1 z-50" />
            </div>
          </div>
        )}

        {/* Marquee */}
        <div className="bg-yellow-100 text-green-900 py-2 overflow-hidden relative text-sm sm:text-base w-full">
          <div className="whitespace-nowrap animate-marquee font-medium px-4">
            🌱 Welcome Farmer | 🌾 View your crop schedules and information | 📅 Don’t forget to save your crop calendar
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

export default FarmerHeader;
