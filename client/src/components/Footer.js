const Footer = () => {
  return (
    <footer className=" h-20 w-full">
        

 
        <ul className="flex justify-center text-sm pt-4 text-gray-500   ">
          <li className="px-4 hover:border-b border-gray-600"><a href="/term"> Terms</a></li>
          <li className="px-4 hover:border-b border-gray-600"><a href="/about">About</a></li>
          <li className="px-4 hover:border-b border-gray-600"><a href="/privacy">Privacy</a></li>
          <li className="px-4 hover:border-b border-gray-600"><a href="/location">Locations</a></li>
          <li className="px-4 hover:border-b border-gray-600"><a href="/jobs">Jobs</a></li>
          <li className="px-4 hover:border-b border-gray-600"><a href="/help">Help</a></li>
          <li className="px-4 hover:border-b border-gray-600"><a href="/blog">Blog</a></li>
          <li className="px-4 hover:border-b border-gray-600"><a href="/contact"> Contact us </a></li>
        </ul>
        <p className="container mx-auto px-4 pt-2 text-sm text-center text-gray-500  ">&copy; 2024 Excel Analytics Platform. Built with the MERN stack.</p> 
        
    </footer>
  );
};
export default Footer;
