import { useEffect, useState } from "react";
import type { Quiz } from "../../types";
import { Link, useParams, useNavigate, useSearchParams } from "react-router";
import { FaArrowLeft } from "react-icons/fa6";

const QuizDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
const [searchParams] = useSearchParams();
const level = searchParams.get("level") || "quiz";
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [answer, setAnswer] = useState<Record<number, string>>({});
  const [modalExit, setModalExit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

 const fetchQuizDetail = async () => {
  try {
    const res = await fetch(`${import.meta.env[`VITE_API_${level.toUpperCase()}`]}?name=${name}`);
    const data = await res.json();

    const selectedQuiz = data.categories.find(
      (q: Quiz) => q.name === name
    );

    setQuiz(selectedQuiz || null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (name) fetchQuizDetail();
  }, [name]);

  useEffect(() => {
    if (!quiz || submitted) return;

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, quiz, submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelect = (qIndex: number, option: string) => {
    setAnswer((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
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

    if (percent <= 20) return "Very Bad Keep trying";
    if (percent <= 50) return "Good don’t give up";
    if (percent <= 80) return "Very Good";
    return "Excellent";
  };

  const saveResult = (score: number, feedback: string) => {
    if (!quiz) return;

    const result = {
      quizName: quiz.name,
      score,
      total: quiz.questions.length,
      level: quiz.difficulty,
      feedback,
      date: new Date().toISOString(),
    };

    const existing = JSON.parse(
      localStorage.getItem("quizResults") || "[]"
    );

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

  const handleExit = () => {
    setModalExit(true);
  };

  const confirmExit = () => {
    saveResult(0, "Canceled");
    navigate("/");
  };

  const cancelExit = () => {
    setModalExit(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading quiz...
      </div>
    );
  }

  if (!quiz) {
    return <p className="text-center text-gray-400">No quiz found</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">

        <button
          onClick={handleExit}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaArrowLeft /> Back to home
        </button>

        {modalExit && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-80 text-center space-y-4">
              <h2 className="text-lg font-bold">Leave Quiz?</h2>
              <p className="text-gray-400 text-sm">
                Your quiz will be canceled and scored as 0.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelExit}
                  className="flex-1 py-2 rounded-lg bg-gray-700"
                >
                  No
                </button>

                <button
                  onClick={confirmExit}
                  className="flex-1 py-2 rounded-lg bg-red-600"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold">Subject: {quiz.name}</h1>

        <div className="bg-gray-800 px-4 py-2 rounded-xl text-sm font-mono">
          ⏱ {formatTime(timeLeft)}
        </div>

        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="space-y-3">
            <h2>{qIndex + 1}. {q.question}</h2>

            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(qIndex, opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition
                ${answer[qIndex] === opt
                    ? "bg-green-500/20 border-green-500"
                    : "bg-gray-900 border-gray-700 hover:bg-gray-700"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={Object.keys(answer).length !== quiz.questions.length}
          className="w-full bg-green-700 py-3 rounded-xl hover:bg-green-500 disabled:opacity-40"
        >
          Submit
        </button>

        {submitted && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-3xl p-10 text-center space-y-6 max-w-md w-full">

              <h2 className="text-3xl font-bold">Quiz Completed</h2>

              <div className="text-6xl font-extrabold text-green-400">
                {calaculatedScore()}/{quiz.questions.length}
              </div>

              <p>
                {Math.round(
                  (calaculatedScore() / quiz.questions.length) * 100
                )}%
              </p>

              <div className="h-3 bg-gray-800 rounded-full">
                <div
                  className="h-3 bg-green-500"
                  style={{
                    width: `${(calaculatedScore() / quiz.questions.length) * 100}%`,
                  }}
                />
              </div>

              <p className="text-xl text-green-400">
                {scoreBased(calaculatedScore())}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-green-600 rounded-xl"
              >
                Restart Quiz
              </button>

              <Link
                to="/"
                className="block py-3 border border-red-400 rounded-xl"
              >
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