import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTelegram } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="w-full bg-emerald-700 text-white px-6 py-8">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Social Links */}
        <div className="flex flex-col md:flex-row  gap-4 text-center">
          <p className="font-semibold">Connect with us:</p>
          <div className="flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FontAwesomeIcon icon={faTelegram} />
            </a>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="text-center text-sm mt-6 space-y-1">
        <p>📍 Address: Vishrambag, Sangli, India</p>
        <p>📞 Helpline: 1800-123-456 | 📧 contact@mazisheti.in</p>
      </div>

      {/* Copyright */}
      <p className="text-xs text-center mt-4">© 2025 Mazisheti, Inc. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
