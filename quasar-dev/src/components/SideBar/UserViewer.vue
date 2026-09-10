<template>
  <div class="text-center">
    <q-avatar
      size="90px"
      :color="usersStore.selectedUser ? 'primary' : 'grey-3'"
      :text-color="usersStore.selectedUser ? 'white' : 'grey-5'"
    >
      <template v-if="usersStore.selectedUser">
        <span v-text="usersStore.getInitialsOfSelectedUser()" />
      </template>
      <template v-else>
        <q-icon name="mdi-account-off-outline" />
      </template>
    </q-avatar>
  </div>
  <div
    class="text-caption text-center q-mt-sm q-mb-sm"
    style="cursor: pointer"
    :class="usersStore.selectedUser ? 'text-blue-grey-9' : 'text-grey-5'"
  >
    <span v-text="usersStore.selectedUser || 'Select the user'" />
    <q-icon name="mdi-menu-down" size="xs" />
    <q-menu>
      <user-picker />
    </q-menu>
  </div>
</template>
<script setup lang="ts">
import UserPicker from "@/components/SideBar/UserPicker.vue";

import { useUsersStore } from "@/stores/users-settings";
const usersStore = useUsersStore();
</script>
