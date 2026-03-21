import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateExam } from "../services/api";

export default function Generate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    subject: "",
    topic: "",
    difficulty: "Medium",
    num_questions: 10,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await generateExam(form);
      const examId = response.data.id;
      navigate(`/exam/${examId}`);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Failed to generate exam. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-white/10">
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-2xl font-bold cursor-pointer"
        >
          Exam<span className="text-blue-400">Genie</span>
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition"
        >
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Generate New Exam</h2>
          <p className="text-blue-200">
            Fill in the details and AI will create your exam instantly
          </p>
        </div>

        {/* Form */}

        {error && (
          <div className="bg-red-500/20 text-red-300 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur rounded-2xl p-8 flex flex-col gap-5"
        >
          {/* Exam Name */}
          <div>
            <label className="text-blue-200 text-sm mb-1 block">
              Exam Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Python Final Exam"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-white/10 text-white placeholder-blue-300 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="text-blue-200 text-sm mb-1 block">Subject</label>
            <input
              name="subject"
              type="text"
              placeholder="e.g. Computer Science"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full bg-white/10 text-white placeholder-blue-300 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Topic */}
          <div>
            <label className="text-blue-200 text-sm mb-1 block">Topic</label>
            <input
              name="topic"
              type="text"
              placeholder="e.g. Object Oriented Programming"
              value={form.topic}
              onChange={handleChange}
              required
              className="w-full bg-white/10 text-white placeholder-blue-300 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Difficulty + Questions — side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-blue-200 text-sm mb-1 block">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full bg-blue-900 text-white border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div>
              <label className="text-blue-200 text-sm mb-1 block">
                Number of Questions
              </label>
              <select
                name="num_questions"
                value={form.num_questions}
                onChange={handleChange}
                className="w-full bg-blue-900 text-white border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition text-lg mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
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
                Generating with AI...
              </span>
            ) : (
              "✨ Generate Exam"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
