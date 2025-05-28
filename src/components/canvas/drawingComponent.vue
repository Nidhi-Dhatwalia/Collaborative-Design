<template>
  <v-dialog v-model="dialog" max-width="400px" max-height="500px"  @keydown.enter="applySettings" >
    <v-card  >
      <v-card-title class="headline">Drawing Settings</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-color-picker
                v-model="lineColor"
                label="Line Color"
                :value="lineColor"
                class="responsive-color-picker"
              ></v-color-picker>
            </v-col>
            <v-col cols="12">
              <v-slider
                v-model="lineWeight"
                label="Line Weight"
                min="1"
                max="10"
                step="1"
                :ticks="[]"
                tick-size="4"
                thumb-label
                class="responsive-slider"
              ></v-slider>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="applySettings">Apply</v-btn>
        <v-btn text @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits();

const lineColor = ref("#000000");
const lineWeight = ref(2);
const dialog = ref(true);

const applySettings = () => {
  const settings = {
    color: lineColor.value,
    weight: lineWeight.value,
  };

  emit("applyDrawingSettings", settings);
  dialog.value = false;
};

const closeDialog = () => {
  dialog.value = false;
};
</script>

<style scoped>
.responsive-color-picker {
  width: 100% !important;
  max-width: 350px;
  margin: auto;
}

 
.v-color-picker__input {
  display: none !important;
}

.responsive-slider {
  width: 100%;
  max-width: 350px;
  margin: auto;
}

@media (max-width: 600px) {
  .v-dialog {
    max-width: 95% !important;
    max-height: 90vh !important;
  }
}
</style>
