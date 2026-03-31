import { useEffect, useState } from "react";
import type { Quiz } from "../../types";
import { Link, useParams, useNavigate, useSearchParams } from "react-router";
import { FaArrowLeft, FaStar } from "react-icons/fa";

const QuizDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const level = searchParams.get("level") || "easy";

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600);
  const [viewwResult, setViewResult] = useState(false);
  const [answer, setAnswer] = useState<Record<number, string>>({});
  const [modalExit, setModalExit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchQuizDetail = async () => {
    try {
      const url = import.meta.env[`VITE_API_${level.toUpperCase()}`];
      const res = await fetch(`${url}/categories`);
      const data = await res.json();
      const list = data.categories || data;
      const selectedQuiz = list.find((q: Quiz) => q.name === name);
      setQuiz(selectedQuiz || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (name) fetchQuizDetail();
  }, [name, level]);

  useEffect(() => {
    if (!quiz || submitted) return;
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, quiz, submitted]);

  const handleSelect = (qIndex: number, option: string) => {
    setAnswer((prev) => ({ ...prev, [qIndex]: option }));
  };

  const calaculatedScore = () => {
    if (!quiz) return 0;
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answer[i] === q.answer) score++;
    });
    return score;
  };

  const scoreBased = (score: number) => {
    if (!quiz) return "";
    const percent = (score / quiz.questions.length) * 100;
    if (percent <= 20) return "Very Bad. Keep trying!";
    if (percent <= 50) return "Good. Don’t give up!";
    if (percent <= 80) return "Very Good!";
    return "Excellent!";
  };

  const saveResult = (score: number, feedback: string) => {
    if (!quiz) return;
    const result = {
      quizName: quiz.name,
      score,
      total: quiz.questions.length,
      level: level,
      feedback,
      date: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("quizResults") || "[]");
    existing.push(result);
    localStorage.setItem("quizResults", JSON.stringify(existing));
  };

  const handleSubmit = () => {
    if (saved) return;
    const score = calaculatedScore();
    const feedback = scoreBased(score);
    saveResult(score, feedback);
    setSaved(true);
    setSubmitted(true);
  };

  const confirmExit = () => {
    saveResult(0, "Canceled");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-xl font-semibold">
        Loading quiz...
      </div>
    );
  }

  const viewResult = () => {
    setViewResult(true);
    handleSubmit();
  }

  if (!quiz) {
    return (
      <div className="text-center text-gray-400 mt-20">
        <Link to="/" className="flex justify-center gap-2 mb-4 items-center text-lg text-blue-400 hover:underline">
          <FaArrowLeft /> Back to Home
        </Link>
        <p className="text-xl font-medium">No quiz found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Exit Button */}
        <button
          onClick={() => setModalExit(true)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Exit Modal */}
        {modalExit && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-2xl text-center space-y-4 max-w-sm w-full">
              <p className="text-lg font-semibold">
                Are you sure you want to exit? Your progress will be lost.
              </p>
              <div className="flex justify-center gap-4 mt-2">
                <button
                  className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  onClick={() => setModalExit(false)}
                >
                  No
                </button>
                <button
                  className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  onClick={confirmExit}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Header */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-2">
          <h1 className="text-3xl font-bold">{quiz.name}</h1>
          <h2 className="text-lg text-gray-300 font-medium">Level: {level}</h2>
          <div className="text-yellow-400 font-mono text-lg">
            ⏱ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((q, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-xl shadow-md space-y-3">
              <h3 className="font-semibold text-lg">{i + 1}. {q.question}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, j) => (
                  <button
                    key={j}
                    onClick={() => handleSelect(i, opt)}
                    className={`p-3 rounded-lg border-2 border-gray-600 hover:border-green-500 transition text-left ${answer[i] === opt ? "bg-green-600 border-green-500 text-white" : "bg-gray-900"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answer).length !== quiz.questions.length || submitted}
          className="w-full bg-green-600 py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>

        {/* Result */}
        {submitted && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-3xl p-10 text-center space-y-6 max-w-md w-full">
              <h2 className="text-3xl font-bold">
                Quiz Completed
              </h2>
              <div className="text-6xl font-extrabold text-green-400">
                {calaculatedScore()}/{quiz.questions.length}
              </div>
              <p>
                {Math.round((calaculatedScore() / quiz.questions.length) * 100)}%
              </p>
              <div className="h-3 bg-gray-800 rounded-full">
                <div
                  className="h-3 bg-green-500"
                  style={{ width: `${(calaculatedScore() / quiz.questions.length) * 100}%` }}
                />
              </div>
              <p className="text-lg font-medium mt-4">
                {scoreBased(calaculatedScore())}
              </p>
              <button 
              onClick={() => window.location.reload()}
               className="w-full py-3 bg-green-600 rounded-xl" >
                 Restart Quiz 
                 </button> 
                 <button
                 onClick={viewResult}
                 className="w-full py-3 bg-yellow-600
                  rounded-xl cursor-pointer"
                 >
                  View Result
                 </button>
                 <Link 
                 to="/" 
                 className="block py-3 border border-red-400 
                 rounded-xl" > 
                 Back to Home
               </Link>
             
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDetail;