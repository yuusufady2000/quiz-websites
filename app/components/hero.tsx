import { useState } from "react";
import { Link } from "react-router";

const Hero = () => {
  const [comingSoon, setComingSoon] = useState(false);

  const handleClick = () => {
    setComingSoon(true);
    setTimeout(() => {
      setComingSoon(false);
    }, 2000);
  };

  return (
    <section className="w-full bg-gray-900 text-white py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Test Your Knowledge!
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Take quizzes across Math, English, Cybersecurity, Frontend, Backend, DevOps, UI/UX, Marketing, and Project Management.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleClick}
            className="bg-green-700 w-full py-2 px-4 rounded-lg font-semibold transition cursor-pointer hover:bg-green-600"
          >
            Learn
          </button>
           {comingSoon && (
            <div className="absolute top-[16rem] left-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
              Coming Soon!
            </div>
          )}
          <Link

            to="/record.tsx"
            className="bg-blue-700 w-full py-2 px-4 rounded-lg font-semibold transition cursor-pointer hover:bg-blue-600"
          >
            View
            Records
          </Link>

         

        </div>
      </div>
    </section>
  );
};

export default Hero;