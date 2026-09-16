<template>Number: {{ variable.name }}</template>

<script setup lang="ts">
const variable = defineModel({
  type: Object as () => GSK_VARIABLE_NUMBER,
  required: true
});

import type { GSK_VARIABLE_NUMBER } from "@/library/types/variables";
</script>
