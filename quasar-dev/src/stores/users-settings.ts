import { defineStore, acceptHMRUpdate } from "pinia";

export const useUsersStore = defineStore("users", {
  persist: true,
  state: () => ({
    users: [] as string[],
    selectedUser: null as string | null,
  }),

  actions: {
    getInitialsOfSelectedUser(): string {
      if (this.selectedUser) {
        const names = this.selectedUser.split(" ");
        const initials = names.map((name) => name.charAt(0).toUpperCase());
        return initials.join("");
      }
      return "";
    },
    addUser(user: string) {
      // Check if the user already exists in the array
      if (!this.users.includes(user)) {
        this.users.push(user);
      }
    },
    selectUser(index: number) {
      if (index >= 0 && index < this.users.length) {
        this.selectedUser = this.users[index] || null;
      } else {
        this.selectedUser = null;
      }
    },
    removeUserAtIndex(index: number) {
      // Remove the user from selectedUser if it matches the one being removed
      if (this.selectedUser === this.users[index]) {
        this.selectedUser = null;
      }

      // Remove the user from the users array
      if (index >= 0 && index < this.users.length) {
        this.users.splice(index, 1);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
