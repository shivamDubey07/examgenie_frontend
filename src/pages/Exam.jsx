import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getExam, submitAttempt } from "../services/api";

export default function Exam() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await getExam(id);
        setExam(response.data);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load exam. Please try again: ${err.response?.data?.detail}`);
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <svg
            className="animate-spin h-10 w-10 mx-auto mb-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <p className="text-blue-200">Loading exam...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-500 rounded-xl text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );

  if (!exam)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Exam not found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-500 rounded-xl text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );

  const questions = exam.questions || [];
  const question = questions[current];
  const total = questions.length;
  const progress = ((current + 1) / total) * 100;

  const handleAnswer = (optionId) => {
    setAnswers({ ...answers, [question.id]: optionId });
  };

  const handleNext = () => {
    if (current < total - 1) setCurrent(current + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await submitAttempt({
        exam_id: id,
        answers: answers,
      });
      navigate(`/results/${response.data.id}`);
    } catch (err) {
      setError(`Failed to submit exam. Please try again: ${err.response?.data?.detail}`);
      setSubmitting(false);
    }
  };

  const isAnswered = (qId) => answers[qId] !== undefined;
  const allAnswered = questions.every((q) => isAnswered(q.id));

  if (!question)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">No questions found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-500 rounded-xl text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white pb-20">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-white/10">
        <h1 className="text-2xl font-bold">
          Exam<span className="text-blue-400">Genie</span>
        </h1>
        <span className="text-blue-200 text-sm">{exam.title}</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-blue-200 mb-2">
            <span>
              Question {current + 1} of {total}
            </span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-6">
          <p className="text-sm text-blue-300 mb-3">Question {current + 1}</p>
          <h2 className="text-xl font-semibold mb-6">{question.text}</h2>

          <div className="flex flex-col gap-3">
            {question.options &&
              question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition
                  ${
                    answers[question.id] === option.id
                      ? "border-blue-400 bg-blue-500/30 text-white"
                      : "border-white/20 bg-white/5 hover:bg-white/10 text-blue-100"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                  ${
                    answers[question.id] === option.id
                      ? "bg-blue-500 text-white"
                      : "bg-white/10"
                  }`}
                  >
                    {String.fromCharCode(
                      65 + question.options.indexOf(option)
                    )}
                  </span>
                  {option.text}
                </button>
              ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-xl font-medium transition"
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition
                  ${
                    i === current
                      ? "bg-blue-400"
                      : isAnswered(q.id)
                        ? "bg-green-400"
                        : "bg-white/20"
                  }`}
              />
            ))}
          </div>

          {current < total - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-medium transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="px-6 py-3 bg-green-500 hover:bg-green-400 disabled:opacity-50 rounded-xl font-medium transition"
            >
              {submitting ? "Submitting..." : "✅ Submit Exam"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
