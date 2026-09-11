<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :icon="appSettings.isSideBarOpen ? 'mdi-menu-open' : 'mdi-menu'"
          aria-label="Menu"
          @click="appSettings.toggleSideBar"
        />
        <q-toolbar-title> Exeriva </q-toolbar-title>
        <q-btn flat dense round aria-label="Settings">
          <q-avatar
            v-if="usersStore.selectedUser"
            size="32px"
            color="white"
            text-color="primary"
          >
            {{ usersStore.getInitialsOfSelectedUser() }}
          </q-avatar>
          <q-icon v-else name="mdi-account-off-outline" />
          <q-menu>
            <pick-user />
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="appSettings.isSideBarOpen" bordered>
      <main-side-bar />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MainSideBar from "@/components/SideBar/MainComponent.vue";
import PickUser from "@/components/SideBar/UserPicker.vue";

import { useAppSettingsStore } from "@/stores/app-settings";
import { useUsersStore } from "@/stores/users-settings";

const appSettings = useAppSettingsStore();
const usersStore = useUsersStore();
</script>
