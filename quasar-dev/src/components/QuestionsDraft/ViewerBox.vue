<template>
  <div v-html="props.draftText" />
</template>
<script setup lang="ts">
const props = defineProps({
  draftText: {
    type: String,
    required: true
  }
});
</script>
