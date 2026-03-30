import { useEffect, useState } from "react";
import { Link } from 'react-router';
import type { Quiz } from "~/types";
type Result = {
  quizName: string;
  score: number;
  total: number;
  feedback: string;
  level: string;
  date: string;
};

const categories = [
  "All",
  "Math",
  "English",
  "Cybersecurity",
  "Frontend",
  "Backend",
  "DevOps",
  "UI/UX",
  "Marketing",
  "Project Manager",
];

const Record = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [records, setRecords] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const fetchStored = () => {
    const stored = localStorage.getItem("quizResults");
    if (stored) {
      setRecords(JSON.parse(stored));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStored();
  }, []);

  const clearRecords = () => {
    localStorage.removeItem("quizResults");
    setRecords([]);
  };


  const filteredRecords =
    selectedCategory === "All"
      ? records
      : records.filter((r) => r.quizName === selectedCategory);

  const total = records.length;

  const avgScore =
    total === 0
      ? 0
      : Math.round(
          records.reduce(
            (acc, r) => acc + (r.score / r.total) * 100,
            0
          ) / total
        );

  const bestScore =
    total === 0
      ? 0
      : Math.round(
          Math.max(...records.map((r) => (r.score / r.total) * 100))
        );
   
      const clearExit = () => {
        setModal(true);
      }

      const confirmClear = () => {
        clearRecords();
        setModal(false);
      }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading records...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-10">

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <Link
          to="/"          
          className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 text-sm"
          >
          Back to Home
          </Link>
          {records.length > 0 && (
            <button
              onClick={clearExit}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 text-sm"
            >
              Clear All
            </button>
          )}

          {modal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-80 text-center space-y-4">
                <p className="font-bold">Are you sure you want to clear all records?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={confirmClear}
                    className="px-4 py-2 bg-red-600 cursor-pointer rounded-lg hover:bg-red-500"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setModal(false)}
                    className="px-4 py-2 bg-gray-600 cursor-pointer rounded-lg hover:bg-gray-500"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center">
              <p className="text-gray-400 text-sm">Total Quizzes</p>
              <h2 className="text-3xl font-bold">{total}</h2>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center">
              <p className="text-gray-400 text-sm">Average Score</p>
              <h2 className="text-3xl font-bold text-green-400">
                {avgScore}%
              </h2>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center">
              <p className="text-gray-400 text-sm">Best Score</p>
              <h2 className="text-3xl font-bold text-yellow-400">
                {bestScore}%
              </h2>
            </div>
             
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition
                ${
                  selectedCategory === cat
                    ? "bg-green-600"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredRecords.length === 0 ? (
          <p className="text-gray-400 text-center">
            No records
          </p>
        ) : (
          <div className="space-y-4">
            {filteredRecords
              .slice()
              .reverse()
              .map((rec, index) => {
                const percent = Math.round(
                  (rec.score / rec.total) * 100
                );

                return (
                  <div
                    key={index}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h2 className="font-semibold">
                          {rec.quizName}
                        </h2>
                        <p className="text-xs text-gray-400">
                          {new Date(rec.date).toLocaleString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-green-400 font-bold">
                          {rec.score}/{rec.total}
                        </p>
                       
                        <h2 
                          className={`text-sm font-medium ${rec.level === "quiz" ? "text-green-400" : rec.level === "medium" ? "text-yellow-400" : "text-red-400"}`}
                        >
                          {rec.level}
                        </h2>
                       
                        <p className="text-xs text-gray-400">
                          {rec.feedback}
                        </p>
                      </div>
                    </div>

                    <div className="h-2 bg-gray-800 rounded-full">
                      <div
                        className="h-2 bg-green-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <p className="text-xs text-right text-gray-400">
                      {percent}%
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Record;