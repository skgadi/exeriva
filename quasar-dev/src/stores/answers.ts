import { defineStore, acceptHMRUpdate } from "pinia";
//import * as math from "mathjs";
import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";
import { prepareQuestionPaperForAnswering } from "@/services/app-utils/variables/answers";

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
          displayingQuestionIndex: 0,
          percentageFinished: 0,
          percentageSeen: 0,
          gradeInPercentage: 0,
          percentageAnswered: 0,
          timeSpentInSeconds: 0,
          totalExpectedTimeInSeconds: 0,
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
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAnswersStore, import.meta.hot));
}
