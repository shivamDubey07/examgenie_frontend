import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMyTests } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import ConfirmModal from "../Modals/ConfirmModal";

const difficultyColor = {
  Easy: "text-green-400 bg-green-400/10",
  Medium: "text-yellow-400 bg-yellow-400/10",
  Hard: "text-red-400 bg-red-400/10",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const username = user?.username || localStorage.getItem("username") || "User";

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await getMyTests();
        setExams(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const scoredExams = exams.filter((e) => e.score);
  const avgScore = scoredExams.length
    ? Math.round(
        scoredExams.reduce((a, b) => a + b.score, 0) / scoredExams.length,
      )
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-white/10">
        <h1 className="text-2xl font-bold">
          Exam<span className="text-blue-400">Genie</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-blue-200 text-sm">Hi, {username} 👋</span>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Confirm Modal — rendered outside nav, at top level */}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to logout?"
          onConfirm={() => {
            handleLogout();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">My Exams</h2>
            <p className="text-blue-200 text-sm mt-1">
              All your generated exams in one place
            </p>
          </div>
          <button
            onClick={() => navigate("/generate")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-semibold transition"
          >
            + Generate New Exam
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Exams", value: exams.length },
            {
              label: "Exams Taken",
              value: exams.filter((e) => e.attempted).length,
            },
            {
              label: "Avg Score",
              value: avgScore !== null ? `${avgScore}%` : "—",
            },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-blue-400">{s.value}</div>
              <div className="text-blue-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <svg
              className="animate-spin h-10 w-10 mx-auto mb-4 text-blue-400"
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
            <p className="text-blue-200">Loading your exams...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && exams.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No exams yet</h3>
            <p className="text-blue-200 text-sm mb-6">
              Generate your first AI exam and it will appear here
            </p>
            <button
              onClick={() => navigate("/generate")}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-semibold transition"
            >
              ✨ Generate First Exam
            </button>
          </div>
        )}

        {/* Exam List */}
        {!loading && exams.length > 0 && (
          <div className="flex flex-col gap-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white/10 rounded-2xl p-5 flex items-center justify-between hover:bg-white/15 transition"
              >
                <div>
                  <h3 className="font-semibold text-lg">{exam.name}</h3>
                  <p className="text-blue-200 text-sm mt-0.5">
                    {exam.subject} · {exam.topic} · {exam.questions?.length}{" "}
                    questions · {new Date(exam.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${difficultyColor[exam.difficulty]}`}
                  >
                    {exam.difficulty}
                  </span>
                  <button
                    onClick={() => navigate(`/exam/${exam.id}`)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-sm font-medium transition"
                  >
                    Take Exam
                  </button>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition">
                    📄 PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
