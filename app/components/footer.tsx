const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-t from-black via-gray-900 to-gray-950 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-400">
        
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">QuizBank</h2>
          <p className="text-sm">
            Test your knowledge across multiple domains and track your progress with smart analytics.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer transition">Home</li>
            <li className="hover:text-white cursor-pointer transition">Records</li>
            <li className="hover:text-white cursor-pointer transition">Learn</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Stay Connected</h3>
          <p className="text-sm mb-3">Get updates and new quizzes.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-3 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-sm focus:outline-none"
            />
            <button className="px-4 py-2 bg-green-600 rounded-r-lg hover:bg-green-500 text-sm">
              Join
            </button>
          </div>
        </div>

      </div>

      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-800">
        © {new Date().getFullYear()} QuizBank. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;