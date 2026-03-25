import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useExamGeneration } from "../hooks/useExamGeneration";

export default function ExamStatusBar() {
  const { examGenerations, pollExamStatus, clearGeneration } =
    useExamGeneration();
  const navigate = useNavigate();

  useEffect(() => {
    const generations = Object.values(examGenerations);
    if (generations.length === 0) return;

    const activeGenerations = generations.filter(
      (gen) => gen.status === "generating",
    );

    if (activeGenerations.length === 0) return;

    const pollInterval = setInterval(() => {
      activeGenerations.forEach((gen) => {
        pollExamStatus(gen.id);
      });
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [examGenerations, pollExamStatus]);

  const generations = Object.values(examGenerations);
  if (generations.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 border-t border-blue-400 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {generations.map((gen) => (
          <div
            key={gen.id}
            className="flex items-center justify-between gap-4 mb-3 last:mb-0"
          >
            <div className="flex items-center gap-4 flex-1">
              {gen.status === "generating" && (
                <svg
                  className="animate-spin h-5 w-5 text-white flex-shrink-0"
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
              )}
              {gen.status === "ready" && (
                <svg
                  className="h-5 w-5 text-green-300 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {gen.status === "failed" && (
                <svg
                  className="h-5 w-5 text-red-300 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              <div className="text-white text-sm">
                <p className="font-semibold">
                  {gen.status === "generating" && "Creating exam..."}
                  {gen.status === "ready" && "✓ Exam ready!"}
                  {gen.status === "failed" && "✗ Generation failed"}
                </p>
                {gen.status === "generating" && (
                  <p className="text-blue-100 text-xs">
                    Your exam is being generated. You can continue using the
                    app.
                  </p>
                )}
                {gen.status === "failed" && gen.failure_reason && (
                  <p className="text-red-100 text-xs">{gen.failure_reason}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {gen.status === "ready" && (
                <button
                  onClick={() => {
                    navigate(`/exam/${gen.id}`);
                    clearGeneration(gen.id);
                  }}
                  className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold rounded-lg transition whitespace-nowrap"
                >
                  Take Exam
                </button>
              )}
              {gen.status === "failed" && (
                <button
                  onClick={() => clearGeneration(gen.id)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-400 text-white text-sm font-semibold rounded-lg transition"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
