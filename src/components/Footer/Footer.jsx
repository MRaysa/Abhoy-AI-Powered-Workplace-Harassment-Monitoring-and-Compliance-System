

const Footer = () => {
  return (
    <footer className="bg-[#0B2B37] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">অভয়</h3>
            <p className="text-gray-300 text-sm">
              Empowering individuals to report workplace harassment anonymously and safely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition">Home</a></li>
              <li><a href="/forum" className="text-gray-300 hover:text-white transition">Community Forum</a></li>
              <li><a href="/submit-complaint" className="text-gray-300 hover:text-white transition">Submit Report</a></li>
              <li><a href="/track-complaint" className="text-gray-300 hover:text-white transition">Track Complaint</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Legal Support</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Email: support@অভয়.com</li>
              <li>Phone: 012-345-6789</li>
              <li>24/7 Crisis Hotline</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} অভয়. All rights reserved. | Breaking the silence safely.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
