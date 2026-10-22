<template>
  <q-input
    dense
    outlined
    rounded
    v-model="password"
    :label="label"
    :type="viewPassword ? 'text' : 'password'"
  >
    <template v-if="icon" #prepend>
      <q-icon :name="icon" />
    </template>
    <template #append>
      <q-icon
        :name="viewPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        class="cursor-pointer"
        @click="viewPassword = !viewPassword"
      />
    </template>
  </q-input>
</template>
<script setup lang="ts">
const password = defineModel({
  type: String,
  required: true
});

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false
  },
  dense: {
    type: Boolean,
    required: false,
    default: false
  }
});

import { ref } from "vue";

const viewPassword = ref(false);
</script>
