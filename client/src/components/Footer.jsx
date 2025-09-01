const Footer = () => {
  return (
    <footer className="bg-white mt-12 w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="/privacy-policy" className="hover:text-primary">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="hover:text-primary">
              Terms of Service
            </a>
            <a href="/contact" className="hover:text-primary">
              Contact Us
            </a>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <i className="fab fa-facebook"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
