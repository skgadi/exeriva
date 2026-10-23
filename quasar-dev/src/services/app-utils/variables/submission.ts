import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
import type { GSK_VARIABLE_EXPRESSION } from "@/library/types/variables";
import { isCorrectAnswer } from "@/services/app-utils/variables/answers";

export const calculateEachAnswerGrade = (
  expressionVariable: GSK_VARIABLE_EXPRESSION,
) => {
  if (!expressionVariable.studentAnswer) return;
  expressionVariable.studentAnswer.isCorrect =
    isCorrectAnswer(expressionVariable);
};
export const submitAnswerSheet = (
  answerSheet: GSK_ANSWER_TO_QUESTION_PAPER,
) => {
  // Grade each answer in the answer sheet
  answerSheet.questionPaper.questions.forEach((question) => {
    question.question.variables.forEach((variable) => {
      if (variable.type === "expression") {
        calculateEachAnswerGrade(variable);
      }
    });
  });

  // Calculate the total grade for the answer sheet
  const totalQuestions = answerSheet.questionPaper.questions.length;
  const correctAnswers = answerSheet.questionPaper.questions.filter(
    (question) =>
      question.question.variables.some(
        (variable) =>
          variable.type === "expression" && variable.studentAnswer?.isCorrect,
      ),
  ).length;

  answerSheet.state.gradeInPercentage =
    totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  // Mark the answer sheet as submitted
  answerSheet.state.isSubmitted = true;
};
