<template>
  <div class="settings-container" :class="{ 'eraser-active': isEraser }">
    <v-card elevation="3" class="settings-card">
      <v-card-title class="headline">Drawing Settings</v-card-title>
      <v-card-text>
        <v-container>
          <v-row dense>

            <!-- Line Color -->
            <v-col cols="12">
              <div class="label">Line Color</div>
              <v-color-picker
                v-model="lineColor"
                hide-inputs
                flat
                class="responsive-color-picker"
                :disabled="isEraser"
              />
            </v-col>

            <!-- Line Weight -->
            <v-col cols="12">
              <div class="label">Line Weight</div>
              <v-slider
                v-model="lineWeight"
                min="1"
                max="30"
                step="1"
                class="responsive-slider"
                thumb-label
                :disabled="isEraser"
              />
            </v-col>
  
            <!-- Eraser Button (Always Visible) + Eraser Size Slider -->
            <v-col cols="12" class="eraser-controls">
              <v-btn
                icon
                :color="isEraser ? 'red darken-2' : 'grey darken-1'"
                @click="toggleEraser"
                :title="isEraser ? 'Eraser active. Click to disable' : 'Enable Eraser mode'"
              >
                <v-icon large>mdi-eraser</v-icon>
              </v-btn>

              <v-slider
                v-if="isEraser"
                v-model="eraserSize"
                min="5"
                max="50"
                step="1"
                class="eraser-slider"
                thumb-label
                label="Eraser Size"
              />
            </v-col>

          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="secondary" @click="resetSettings">Reset</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["applyDrawingSettings"]);

const lineColor = ref("#000000");
const lineWeight = ref(5);
const lineOpacity = ref(1);
const lineStyle = ref("solid");
const isEraser = ref(false);
const eraserSize = ref(20);

const toggleEraser = () => {
  isEraser.value = !isEraser.value;
};

watch([lineColor, lineWeight, lineOpacity, lineStyle, isEraser, eraserSize], () => {
  emit("applyDrawingSettings", {
    color: isEraser.value ? "#ffffff" : lineColor.value,
    weight: isEraser.value ? eraserSize.value : lineWeight.value,
    opacity: isEraser.value ? 1 : lineOpacity.value,
    style: lineStyle.value,
    isEraser: isEraser.value,
  });
});

const resetSettings = () => {
  isEraser.value = false;
  lineColor.value = "#000000";
  lineWeight.value = 5;
  lineOpacity.value = 1;
  lineStyle.value = "solid";
  eraserSize.value = 20;
};
</script>

<style scoped>
.settings-container {
  display: flex;
  justify-content: center;
  padding: 24px;
  background-color: #f9f9f9;
  cursor: default;
}

.settings-container.eraser-active {
  cursor: none;
  position: relative;
}

.settings-card {
  width: 100%;
  max-width: 420px;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.label {
  font-weight: 600;
  font-size: 14px;
  margin-top: 8px;
  color: #333;
}

.responsive-color-picker,
.responsive-slider {
  width: 100%;
  max-width: 360px;
  margin: auto;
}

.eraser-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-start;
}

.eraser-slider {
  max-width: 200px;
  flex-grow: 1;
}
</style>