import { useContext } from "react";
import { ExamGenerationContext } from "../contexts/ExamGenerationContextDef";

export const useExamGeneration = () => {
  const context = useContext(ExamGenerationContext);
  if (!context) {
    throw new Error(
      "useExamGeneration must be used within ExamGenerationProvider",
    );
  }
  return context;
};
