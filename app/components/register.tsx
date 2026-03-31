import { useEffect, useState } from "react";
import type { Quiz } from "~/types";
import { Link, useSearchParams } from "react-router";
import { FaArrowLeft } from "react-icons/fa6";

const RegisterPage = () => {
  
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
   const [modal, setModal] = useState(false);
   const [selectQuiz, selectedQuiz] = useState<Quiz | null>(null);

  const fetchQuiz = async () => {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_EASY}/categories`);
    const data = await res.json();
    setQuiz(data);
    console.log(data);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleModal = (q: Quiz) => {
    selectedQuiz(q);
    setModal(true);
  }

  if (loading) {
    return (
      <div className=" bg-gray-950 flex items-center text-xl justify-center h-screen text-gray-400">
        Loading quizzes...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-19 py-13">
  
      <h1 className="text-4xl font-bold text-center mb-12">
        Choose a Category
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {quiz?.map((q) => (
          <div
            key={q.name}
            className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl "
          >
            <div className="overflow-hidden">
              <img
                src={q.image}
                alt={q.name}
                className="w-full h-44 object-cover "
              />
            </div>

            <div className="p-5 text-center space-y-4">
              <h2 className="text-xl font-semibold tracking-wide">
                {q.name}
              </h2>

              <button
                onClick={() => handleModal(q)}
                className="w-full py-2 rounded-lg 
                cursor-pointer bg-green-600 hover:bg-green-500 transition font-medium"
              >
                Take Quiz
              </button>
            </div>
          </div>
        ))}
        
      </div>
    
      {modal && selectQuiz && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl space-y-6 w-80 text-center border border-gray-700">
            <h2 className="text-xl font-bold">
              Select level
            </h2>

            <div className="space-y-3">
              <Link
                to={`/quizDisplay/${selectQuiz.name}?level=easy`}
                className="block w-full py-2 rounded-lg bg-green-600 hover:bg-green-500"
              >
                Easy
              </Link>

              <Link
                to={`/quizDisplay/${selectQuiz.name}?level=medium`}
                className="block w-full py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500"
              >
                Medium
              </Link>

              <Link
                to={`/quizDisplay/${selectQuiz.name}?level=hard`}
                className="block w-full py-2 rounded-lg bg-red-600 hover:bg-red-500"
              >
                Hard
              </Link>
            </div>

            <button
              onClick={() => setModal(false)}
              className="text-sm text-gray-400 hover:text-white mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
