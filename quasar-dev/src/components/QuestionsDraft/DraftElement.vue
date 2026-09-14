<template>
  <q-expansion-item
    class="shadow-1"
    :icon="colorLabelLookup[props.section]?.icon || 'mdi-help'"
    :label="colorLabelLookup[props.section]?.label || 'Unknown'"
    :header-class="
      colorLabelLookup[props.section]?.headerClass || 'bg-grey-3 text-black'
    "
    expand-icon-class="text-white"
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
              <div class="text-h6">variables</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

            <q-tab-panel name="preview">
              <viewer-box :draft-text="draftElement.text" />
            </q-tab-panel>
          </q-tab-panels>
        </template>
        <template v-slot:after>
          <viewer-box :draft-text="draftElement.text" />
        </template>
      </q-splitter>
    </div>
    <!--q-splitter v-model="appSettingsStore.splitterPosition" :limits="[20, 80]">
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab no-caps name="draft" label="Draft" />
          <q-tab no-caps name="variables" label="Variables" />
          <q-tab no-caps name="preview" label="Preview" />
          <q-btn
            dense
            round
            no-caps
            flat
            :title="
              appSettingsStore.showSplitter ? 'Hide Splitter' : 'Show Splitter'
            "
            :icon="
              appSettingsStore.isSideBarOpen ? 'mdi-menu-open' : 'mdi-menu'
            "
            @click="
              appSettingsStore.showSplitter = !appSettingsStore.showSplitter
            "
          />
        </q-tabs>

        <q-separator />
        <q-tab-panels v-model="tab" animated style="height: 50vh">
          <q-tab-panel name="draft" class="q-pa-none" style="height: 100%">
            <editor-box v-model="draftElement.text" />
          </q-tab-panel>

          <q-tab-panel name="variables" style="height: 100%">
            <div class="text-h6">variables</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="preview">
            <viewer-box :draft-text="draftElement.text" />
          </q-tab-panel>
        </q-tab-panels>
      </template>
      <template v-slot:after>
        <viewer-box :draft-text="draftElement.text" />
      </template>
    </q-splitter-->
  </q-expansion-item>
</template>

<script setup lang="ts">
const props = defineProps({
  section: {
    type: String as () => "header" | "question" | "answer" | "footer",
    required: true
  }
});

const draftElement = defineModel({
  type: Object as () => GSK_DRAFT_ELEMENT,
  required: true
});

import EditorBox from "@/components/QuestionsDraft/EditorBox.vue";
import viewerBox from "@/components/QuestionsDraft/ViewerBox.vue";

import { ref, watch } from "vue";
import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";
import { useAppSettingsStore } from "@/stores/app-settings";

const appSettingsStore = useAppSettingsStore();

const isExpanded = ref(false);
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
    icon: "mdi-page-layout-header"
  },
  question: {
    headerClass: "bg-secondary text-white",
    label: "Question",
    icon: "mdi-help"
  },
  answer: {
    headerClass: "bg-accent text-white",
    label: "Answer",
    icon: "mdi-message-reply-text-outline"
  },
  footer: {
    headerClass: "bg-negative text-white",
    label: "Footer",
    icon: "mdi-page-layout-footer"
  }
};
</script>
