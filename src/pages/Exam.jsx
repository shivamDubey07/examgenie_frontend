import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getExam,
  startExam,
  saveAnswer,
  sendHeartbeat,
  abandonAttempt,
  submitAttempt,
} from "../services/api";
import toast from "react-hot-toast";

// Format seconds into MM:SS
function formatTime(seconds) {
  if (seconds <= 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Exam() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Exam data
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Session
  const [sessionToken, setSessionToken] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isResume, setIsResume] = useState(false);

  // Answers: { question_id: option_id }
  const [answers, setAnswers] = useState({});

  // UI state
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const [abandonLoading, setAbandonLoading] = useState(false);

  // Refs to avoid stale closures in intervals
  const sessionTokenRef = useRef(null);
  const timeRemainingRef = useRef(null);
  const hasAutoSubmitted = useRef(false);

  // ------------------------------------------------------------------
  // Block browser navigation while in exam
  // ------------------------------------------------------------------
  useEffect(() => {
    // Push a state so the user has a "back" entry to block
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Push again to prevent back navigation
      window.history.pushState(null, "", window.location.href);
      toast.error("You can't navigate away during an exam.");
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // ------------------------------------------------------------------
  // Load exam + start session
  // ------------------------------------------------------------------
  useEffect(() => {
    const init = async () => {
      try {
        // Start or resume session first
        const sessionRes = await startExam(id);
        const {
          session_token,
          time_remaining_seconds,
          is_resume,
          saved_answers,
        } = sessionRes.data;

        sessionTokenRef.current = session_token;
        timeRemainingRef.current = time_remaining_seconds;

        setSessionToken(session_token);
        setTimeRemaining(time_remaining_seconds);
        setIsResume(is_resume);

        if (
          is_resume &&
          saved_answers &&
          Object.keys(saved_answers).length > 0
        ) {
          setAnswers(saved_answers);
          toast.success("Resuming your previous session.");
        }

        // Fetch exam questions
        const examRes = await getExam(id);
        setExam(examRes.data);
      } catch (err) {
        const detail = err.response?.data?.detail;
        const status = err.response?.status;

        if (status === 409) {
          setError(detail || "This exam is open on another device.");
        } else {
          setError(detail || "Failed to start exam. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id]);

  // ------------------------------------------------------------------
  // Auto-submit when time runs out
  // ------------------------------------------------------------------
  const handleAutoSubmit = useCallback(async () => {
    if (hasAutoSubmitted.current) return;
    hasAutoSubmitted.current = true;

    toast.error("Time is up! Submitting your exam...");

    try {
      const response = await submitAttempt({
        exam_session_token: sessionTokenRef.current,
      });
      navigate(`/results/${response.data.id}`, { replace: true });
    } catch (err) {
      toast.error(
        `Auto-submit failed. Please contact support. (${err.response?.data?.detail || err.message})`,
      );
    }
  }, [navigate]);

  // ------------------------------------------------------------------
  // Countdown timer
  // ------------------------------------------------------------------
  useEffect(() => {
    if (timeRemainingRef.current === null) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        timeRemainingRef.current = prev - 1;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [handleAutoSubmit]);

  // ------------------------------------------------------------------
  // Heartbeat every 30s
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!sessionToken) return;

    const interval = setInterval(async () => {
      try {
        await sendHeartbeat({ session_token: sessionTokenRef.current });
      } catch {
        // Silently fail — timer is source of truth for expiry
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [sessionToken]);

  // ------------------------------------------------------------------
  // Answer selection — save immediately
  // ------------------------------------------------------------------
  const handleAnswer = async (questionId, optionId) => {
    // Optimistic update
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    try {
      await saveAnswer({
        session_token: sessionTokenRef.current,
        question_id: questionId,
        option_id: optionId,
      });
    } catch {
      // Don't show error on every keystroke — answers are still in local state
      // They'll be scored from DB on submit, which has the latest saved state
    }
  };

  // ------------------------------------------------------------------
  // Manual submit
  // ------------------------------------------------------------------
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await submitAttempt({
        exam_session_token: sessionTokenRef.current,
      });
      navigate(`/results/${response.data.id}`, { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to submit. Please try again.",
      );
      setSubmitting(false);
    }
  };

  // ------------------------------------------------------------------
  // Abandon
  // ------------------------------------------------------------------
  const handleAbandon = async () => {
    setAbandonLoading(true);
    try {
      await abandonAttempt({ session_token: sessionTokenRef.current });
      toast.success("Exam abandoned.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(
        `Failed to abandon exam. Please try again. (${err.response?.data?.detail || err.message})`,
      );
      setAbandonLoading(false);
      setShowAbandonConfirm(false);
    }
  };

  // ------------------------------------------------------------------
  // Loading / error states
  // ------------------------------------------------------------------
  if (loading) {
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
          <p className="text-blue-200">Starting exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-300 text-lg mb-2 font-semibold">
            Cannot Start Exam
          </p>
          <p className="text-blue-200 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-500 rounded-xl text-white font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  const questions = exam.questions || [];
  const question = questions[current];
  const total = questions.length;
  const progress = ((current + 1) / total) * 100;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const isTimeLow = timeRemaining !== null && timeRemaining < 300; // under 5 min

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white pb-20">
      {/* Abandon confirm modal */}
      {showAbandonConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-blue-900 border border-white/20 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Abandon Exam?</h3>
            <p className="text-blue-200 text-sm mb-6">
              Your attempt will be marked as abandoned and will not be scored.
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAbandonConfirm(false)}
                disabled={abandonLoading}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition"
              >
                Keep Going
              </button>
              <button
                onClick={handleAbandon}
                disabled={abandonLoading}
                className="flex-1 py-3 bg-red-500 hover:bg-red-400 disabled:opacity-50 rounded-xl font-medium transition"
              >
                {abandonLoading ? "Abandoning..." : "Yes, Abandon"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h1 className="text-xl font-bold">
          Exam<span className="text-blue-400">Genie</span>
        </h1>

        <div className="flex items-center gap-4">
          {/* Timer */}
          {timeRemaining !== null && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm ${
                isTimeLow
                  ? "bg-red-500/20 text-red-300 border border-red-500/40"
                  : "bg-white/10 text-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatTime(timeRemaining)}
            </div>
          )}

          {isResume && (
            <span className="text-xs text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
              Resumed
            </span>
          )}

          <button
            onClick={() => setShowAbandonConfirm(true)}
            className="px-4 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
          >
            Abandon
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Exam title + progress */}
        <div className="mb-6">
          <p className="text-blue-300 text-sm mb-1">{exam.title}</p>
          <div className="flex justify-between text-xs text-blue-300 mb-2">
            <span>
              Question {current + 1} of {total}
            </span>
            <span>
              {answeredCount} of {total} answered
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div
              className="bg-blue-400 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        {question && (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
            <p className="text-xs text-blue-300 mb-3 uppercase tracking-wide">
              Question {current + 1}
            </p>
            <h2 className="text-lg font-semibold mb-6 leading-relaxed">
              {question.text}
            </h2>

            <div className="flex flex-col gap-3">
              {question.options?.map((option, idx) => {
                const isSelected = answers[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(question.id, option.id)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition ${
                      isSelected
                        ? "border-blue-400 bg-blue-500/30 text-white"
                        : "border-white/20 bg-white/5 hover:bg-white/10 text-blue-100"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        isSelected ? "bg-blue-500 text-white" : "bg-white/10"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-xl font-medium transition"
          >
            ← Previous
          </button>

          {/* Question dots */}
          <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                title={`Question ${i + 1}`}
                className={`w-3 h-3 rounded-full transition ${
                  i === current
                    ? "bg-blue-400 scale-125"
                    : answers[q.id]
                      ? "bg-green-400"
                      : "bg-white/20"
                }`}
              />
            ))}
          </div>

          {current < total - 1 ? (
            <button
              onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
              className="px-5 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-medium transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="px-5 py-3 bg-green-500 hover:bg-green-400 disabled:opacity-50 rounded-xl font-medium transition"
            >
              {submitting ? "Submitting..." : "✅ Submit"}
            </button>
          )}
        </div>

        {/* Submit warning if not all answered */}
        {current === total - 1 && !allAnswered && (
          <p className="text-center text-yellow-400 text-sm mt-4">
            {total - answeredCount} question
            {total - answeredCount !== 1 ? "s" : ""} unanswered. Answer all
            questions to submit.
          </p>
        )}
      </div>
    </div>
  );
}
