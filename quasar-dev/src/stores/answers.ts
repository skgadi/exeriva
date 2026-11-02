import { defineStore, acceptHMRUpdate } from "pinia";
//import * as math from "mathjs";
import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";
import { prepareQuestionPaperForAnswering } from "@/services/app-utils/variables/answers";
import { submitAnswerSheet } from "@/services/app-utils/variables/submission";

export const useAnswersStore = defineStore("answers", {
  persist: true,
  state: () => ({
    answers: [] as GSK_ANSWER_TO_QUESTION_PAPER[],
  }),
  getters: {
    unSubmittedAnswers: (state) => {
      return state.answers.filter((a) => !a.state.isSubmitted);
    },
    submittedAnswers: (state) => {
      return state.answers.filter((a) => a.state.isSubmitted);
    },
  },
  actions: {
    prepareANewAnswerForQuestionPaper(
      questionPaper: GSK_QUESTION_PAPER_DRAFT,
      studentName: string,
    ): GSK_ANSWER_TO_QUESTION_PAPER {
      const newAnswer: GSK_ANSWER_TO_QUESTION_PAPER = {
        id: crypto.randomUUID(),
        studentName: studentName,
        questionPaper: prepareQuestionPaperForAnswering(questionPaper),
        state: {
          isSubmitted: false,
          displayingQuestionIndex: -1,
          percentageFinished: 0,
          percentageSeen: 0,
          gradeInPercentage: 0,
          percentageAnswered: 0,
          timeSpentInSeconds: 0,
          totalExpectedTimeInSeconds: 0,
          percentageSolutionSeen: 0,
        },
        log: {
          answered: [],
          seen: [],
          solutionSeen: [],
          questionSeen: [],
          sessions: [],
        },
      };
      this.answers.push(newAnswer);
      return newAnswer;
    },
    loadAnswerSheetFromId(
      id: string,
    ): GSK_ANSWER_TO_QUESTION_PAPER | undefined {
      return this.answers.find((a) => a.id === id);
    },
    startASession(answerId: string) {
      const answerSheet = this.answers.find((a) => a.id === answerId);
      if (!answerSheet) {
        return;
      }
      // If answerSheet is submitted, then we do not create a new session.
      if (answerSheet.state.isSubmitted) {
        return;
      }
      // If the answer sheet is configured to be completed in one session only, then we do not create a new session.
      if (
        answerSheet.log.sessions.length > 0 &&
        answerSheet.questionPaper.settings.finishInOneSession
      ) {
        // If the answer sheet is configured to be completed in one session only, then we do not create a new session.
        // We submit the existing answer sheet.
        submitAnswerSheet(answerSheet);
        return;
      }

      answerSheet.log.sessions.push({
        startTime: Date.now(),
        endTime: -1, // -1 indicates that the session is still ongoing and has not ended yet.
      });
    },
    closeASession(answerId: string) {
      const answerSheet = this.answers.find((a) => a.id === answerId);
      if (!answerSheet) {
        return;
      }
      const lastSession = answerSheet.log.sessions.at(-1);
      if (lastSession && lastSession.endTime === -1) {
        lastSession.endTime = Date.now();
      }
      // If the answer sheet is configured to be completed in one session only, then we submit the answer sheet.
      if (answerSheet.questionPaper.settings.finishInOneSession) {
        submitAnswerSheet(answerSheet);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAnswersStore, import.meta.hot));
}
