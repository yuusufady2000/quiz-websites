import { useState } from "react";
import { Link } from "react-router";

const Header = () => {

const [comingSoon, setComingSoon] = useState(false);

const handleClick = () => {
  setComingSoon(true);
  setTimeout(() => {
    setComingSoon(false);
  }, 2000);
}

  return (
    <header className="w-full bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-bold text-white">
          QuizBank
        </div>
        <nav className="space-x-6">
         
         <Link
         to=''
          onClick={handleClick}
          className="text-gray-300 hover:text-white transition-colors"
         >
         Learn
         </Link>
          <Link to="record.tsx" className="text-gray-300 hover:text-white transition-colors">
            Record
          </Link>
          
        </nav>

        {comingSoon && (
          <div className="absolute top-16 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
            Coming Soon!
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;