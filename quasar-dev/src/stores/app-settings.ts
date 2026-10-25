import { defineStore, acceptHMRUpdate } from "pinia";

export const useAppSettingsStore = defineStore("appSettings", {
  persist: true,
  state: () => ({
    isSideBarOpen: false,
    pinPreview: true,
    pinnedPreviewSize: 50,
    sidebarWidth: 300,
    scratchpadWidth: 360,
    isScratchpadOpen: false,
  }),

  getters: {
    isSideBarClosed: (state) => !state.isSideBarOpen,
  },

  actions: {
    toggleSideBar() {
      this.isSideBarOpen = !this.isSideBarOpen;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppSettingsStore, import.meta.hot));
}
