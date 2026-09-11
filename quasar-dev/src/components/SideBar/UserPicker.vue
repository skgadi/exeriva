<template>
  <q-input
    v-model="rawFilter"
    dense
    outlined
    rounded
    placeholder="Search users..."
  >
    <template v-slot:before>
      <q-icon class="q-ml-xs" name="mdi-magnify" slot="prepend" />
    </template>
    <template v-slot:after>
      <q-btn
        class="q-mr-xs"
        :disable="filteredUsers.length > 0"
        flat
        round
        @click="usersStore.addUser(filter)"
        dense
        icon="mdi-plus"
      />
    </template>
  </q-input>
  <q-list bordered v-if="filteredUsers.length > 0" dense>
    <q-item v-for="(user, index) in filteredUsers" :key="user">
      <q-item-section>
        <q-item-label>{{ user }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            class="text-green"
            size="12px"
            flat
            dense
            round
            icon="done"
            :disable="usersStore.selectedUser === user"
            @click="usersStore.selectUser(index)"
          />
          <q-btn
            class="text-red"
            size="12px"
            flat
            dense
            round
            icon="delete"
            @click="usersStore.removeUserAtIndex(index)"
          />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useUsersStore } from "@/stores/users-settings";
const usersStore = useUsersStore();

const rawFilter = ref("");
const filter = computed(() => {
  // remove leading and trailing whitespace from the filter
  // Remove special characters from the filter keep space between wordss
  return rawFilter.value.trim().replace(/[^a-zA-Z0-9 ]/g, "");
});
const filteredUsers = computed(() => {
  if (!filter.value) {
    return usersStore.users;
  }
  return usersStore.users.filter(user =>
    user.toLowerCase().includes(filter.value.toLowerCase())
  );
});
</script>
