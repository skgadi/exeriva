<template>
  <q-expansion-item
    class="shadow-1"
    :icon="colorLabelLookup[props.section]?.icon || 'mdi-help'"
    :label="colorLabelLookup[props.section]?.label || 'Unknown'"
    :header-class="
      colorLabelLookup[props.section]?.headerClass || 'bg-grey-3 text-black'
    "
    default-opened
    hide-expand-icon
    v-model="isExpanded"
  >
    <template #header>
      <q-item-section avatar>
        <q-icon :name="colorLabelLookup[props.section]?.icon || 'mdi-help'" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6">
          {{ colorLabelLookup[props.section]?.label || "Unknown" }}
        </q-item-label>
      </q-item-section>
      <q-item-section side v-if="isExpanded">
        <q-btn
          dense
          rounded
          class="q-px-sm"
          :flat="tab !== 'draft'"
          :outline="tab === 'draft'"
          no-caps
          icon="mdi-pencil-outline"
          label="Draft"
          @click.stop="tab = 'draft'"
        />
      </q-item-section>
      <q-item-section side v-if="isExpanded">
        <q-btn
          dense
          rounded
          class="q-px-sm"
          :flat="tab !== 'variables'"
          :outline="tab === 'variables'"
          no-caps
          icon="mdi-cog-outline"
          label="Variables"
          @click.stop="tab = 'variables'"
        />
      </q-item-section>
      <q-item-section side v-if="isExpanded && !appSettingsStore.pinPreview">
        <q-btn
          dense
          rounded
          class="q-px-sm"
          :flat="tab !== 'preview'"
          :outline="tab === 'preview'"
          no-caps
          icon="mdi-eye-outline"
          label="Preview"
          @click.stop="tab = 'preview'"
        />
      </q-item-section>
      <q-item-section side v-if="isExpanded">
        <q-btn
          dense
          round
          flat
          :icon="
            appSettingsStore.pinPreview
              ? 'mdi-pin-outline'
              : 'mdi-pin-off-outline'
          "
          :title="
            appSettingsStore.pinPreview
              ? 'Unpin the preview'
              : 'Pin the preview'
          "
          @click.stop="
            appSettingsStore.pinPreview = !appSettingsStore.pinPreview
          "
        />
      </q-item-section>
      <q-item-section side>
        <q-btn
          dense
          round
          flat
          :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          @click.stop="isExpanded = !isExpanded"
        />
      </q-item-section>
    </template>
    <div style="height: calc(100vh - 200px); overflow: hidden">
      <q-splitter
        v-model="splitterPosition"
        :limits="appSettingsStore.pinPreview ? [20, 80] : [100, 100]"
        style="height: 100%"
      >
        <template v-slot:before>
          <q-tab-panels v-model="tab" animated style="height: 100%">
            <q-tab-panel name="draft" class="q-pa-none" style="height: 100%">
              <editor-box v-model="draftElement.text" />
            </q-tab-panel>

            <q-tab-panel name="variables" style="height: 100%">
              <edit-variables-box
                v-model="draftElement"
                @needs-evaluation="evaluateExpression(draftElement.variables)"
              />
            </q-tab-panel>

            <q-tab-panel name="preview">
              <viewer-box
                :draft-text="draftElement.text"
                v-model="draftElement.variables"
              />
            </q-tab-panel>
          </q-tab-panels>
        </template>
        <template v-slot:after>
          <viewer-box
            :draft-text="draftElement.text"
            v-model="draftElement.variables"
          />
        </template>
      </q-splitter>
    </div>
  </q-expansion-item>
</template>

<script setup lang="ts">
const props = defineProps({
  section: {
    type: String as () => "header" | "question" | "solution" | "footer",
    required: true
  }
});

const draftElement = defineModel({
  type: Object as () => GSK_DRAFT_ELEMENT,
  required: true
});

import EditorBox from "@/components/QuestionsDraft/EditorBox.vue";
import ViewerBox from "@/components/QuestionsDraft/ViewerBox.vue";
import EditVariablesBox from "@/components/QuestionsDraft/EditVariablesBox.vue";

import { ref, watch } from "vue";
import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";
import { useAppSettingsStore } from "@/stores/app-settings";
import { evaluateExpression } from "@/services/app-utils/variables/evaluate-expressions";
import { updateVariables } from "@/services/app-utils/variables/handle-variable-manipulation";

const appSettingsStore = useAppSettingsStore();

const tab = ref("draft");
const splitterPosition = ref(
  appSettingsStore.pinPreview ? appSettingsStore.pinnedPreviewSize : 100
);

watch(
  () => splitterPosition.value,
  newValue => {
    if (appSettingsStore.pinPreview) {
      appSettingsStore.pinnedPreviewSize = newValue;
    }
  }
);

watch(
  () => appSettingsStore.pinPreview,
  newValue => {
    if (!newValue) {
      splitterPosition.value = 100;
      return;
    }
    splitterPosition.value = appSettingsStore.pinnedPreviewSize;
    if (tab.value === "preview") {
      tab.value = "draft";
    }
  }
);

const colorLabelLookup = {
  header: {
    headerClass: "bg-primary text-white",
    label: "Header",
    icon: "mdi-page-layout-header",
    defaultOpened: false
  },
  question: {
    headerClass: "bg-secondary text-white",
    label: "Problem",
    icon: "mdi-help",
    defaultOpened: true
  },
  solution: {
    headerClass: "bg-accent text-white",
    label: "Solution",
    icon: "mdi-message-reply-text-outline",
    defaultOpened: true
  },
  footer: {
    headerClass: "bg-negative text-white",
    label: "Footer",
    icon: "mdi-page-layout-footer",
    defaultOpened: false
  }
};

watch(
  () => draftElement.value.text,
  () => {
    updateVariables(draftElement.value);
  }
);

const isExpanded = ref(colorLabelLookup[props.section]?.defaultOpened);
</script>
