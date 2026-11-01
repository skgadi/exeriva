<template>
  <q-chip>
    <q-avatar color="white" text-color="white">
      <q-circular-progress
        :value="props.percentage"
        :thickness="0.75"
        :color="props.color"
        size="28px"
        track-color="grey-5"
      />
    </q-avatar>
    {{ props.title }}: {{ props.percentage }}%
  </q-chip>
</template>
<script setup lang="ts">
const props = defineProps({
  percentage: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    default: "primary"
  },
  title: {
    type: String,
    required: true
  }
});
</script>
