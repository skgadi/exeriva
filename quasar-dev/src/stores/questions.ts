import { defineStore, acceptHMRUpdate } from "pinia";

import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";

export const useQuestionsStore = defineStore("questions", {
  persist: true,
  state: () => ({
    questionPaperDrafts: [] as GSK_QUESTION_PAPER_DRAFT[],
  }),

  getters: {
    getQuestionpaperDisplay: (state) => {
      
    },
  },

  actions: {
    toggleSideBar() {
      this.isSideBarOpen = !this.isSideBarOpen;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useQuestionsStore, import.meta.hot));
}
