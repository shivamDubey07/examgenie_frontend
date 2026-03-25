import { useState } from "react";
import { ExamGenerationContext } from "./ExamGenerationContextDef";
import { getExamStatus } from "../services/api";

export const ExamGenerationProvider = ({ children }) => {
  const [examGenerations, setExamGenerations] = useState({});

  const startGeneration = (examId) => {
    setExamGenerations((prev) => ({
      ...prev,
      [examId]: {
        id: examId,
        status: "generating",
        message: "Creating your exam...",
        startTime: new Date(),
      },
    }));
  };

  const pollExamStatus = async (examId) => {
    try {
      const response = await getExamStatus(examId);
      setExamGenerations((prev) => ({
        ...prev,
        [examId]: {
          ...prev[examId],
          status: response.data.status,
          question_count: response.data.question_count,
          failure_reason: response.data.failure_reason,
        },
      }));
      return response.data.status;
    } catch (_err) {
      setExamGenerations((prev) => ({
        ...prev,
        [examId]: {
          ...prev[examId],
          status: "error",
          error: `Failed to poll status: ${_err.response?.data?.detail}`,
        },
      }));
    }
  };

  const clearGeneration = (examId) => {
    setExamGenerations((prev) => {
      const updated = { ...prev };
      delete updated[examId];
      return updated;
    });
  };

  return (
    <ExamGenerationContext.Provider
      value={{
        examGenerations,
        startGeneration,
        pollExamStatus,
        clearGeneration,
      }}
    >
      {children}
    </ExamGenerationContext.Provider>
  );
};
