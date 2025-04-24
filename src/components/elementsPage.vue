<template>
  <v-container class="d-flex justify-center">
    <v-row class="pa-0 ma-0" justify="center">
      <v-col cols="auto" class="mx-2">
        <v-btn @click="createShape('rectangle')">
          <v-icon size="x-large">mdi-rectangle</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto" class="mx-2">
        <v-btn @click="createShape('circle')">
          <v-icon size="x-large">mdi-circle</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto" class="mx-2">
        <v-btn @click="createShape('triangle')">
          <v-icon size="x-large">mdi-triangle</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto" class="mx-2">
        <v-btn @click="createShape('text')">
          <v-icon size="x-large">mdi-format-text</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto" class="mx-2">
        <v-btn @click="zoomIn">
          <v-icon size="x-large">mdi-magnify-plus</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto" class="mx-2">
        <v-btn @click="zoomOut">
          <v-icon size="x-large">mdi-magnify-minus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <div v-show="isObjectSelected" class="color-picker-container">
    <input type="color" v-model="selectedColor" @input="updateColor" />
  </div>

  <div class="button-container">
    <v-btn v-show="isObjectSelected" @click="deleteSelected">
      <v-icon size="x-large">mdi-delete</v-icon>
    </v-btn>
    <v-btn v-show="isObjectSelected" @click="editSelected">
      <v-icon size="x-large">mdi-pencil</v-icon>
    </v-btn>
  </div>

  <!-- Text Settings Dialog -->
  <v-dialog v-model="showTextDialog" max-width="500px">
    <textSettings
      @apply="handleTextApply"
      @close="showTextDialog = false"
    />
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useGlobalCanvas } from "../composables/globalCanvas";
import textSettings from '../components/textSettings.vue';

const { canvas, initCanvas } = useGlobalCanvas();

const selectedColor = ref("#000000");
const isObjectSelected = ref(false);
const zoomLevel = ref(1);
const showTextDialog = ref(false);

const saveCanvasState = () => {
  const currentState = canvas.value.toJSON();
  localStorage.setItem("savedDesign", JSON.stringify(currentState));
};

onMounted(() => {
  const initializedCanvas = initCanvas();

  if (initializedCanvas) {
    initializedCanvas.on("selection:created", () => {
      isObjectSelected.value = true;
    });

    initializedCanvas.on("selection:updated", () => {
      isObjectSelected.value = true;
    });

    initializedCanvas.on("selection:cleared", () => {
      isObjectSelected.value = false;
    });

    initializedCanvas.on("mouse:wheel", (opt) => {
      const delta = opt.e.deltaY;
      if (delta > 0) {
        zoomOut();
      } else {
        zoomIn();
      }
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  } else {
    console.error("Canvas not initialized properly");
  }
});

watch(selectedColor, (newColor) => {
  const activeObject = canvas.value.getActiveObject();
  if (activeObject) {
    activeObject.set({ fill: newColor });
    canvas.value.renderAll();
    saveCanvasState();
  }
});

const createShape = (type) => {
  let shape = null;

  if (type === "rectangle") {
    shape = new fabric.Rect({ width: 100, height: 100, fill: selectedColor.value, left: 50, top: 50 });
  } else if (type === "circle") {
    shape = new fabric.Circle({ radius: 50, fill: selectedColor.value, left: 100, top: 50 });
  } else if (type === "triangle") {
    shape = new fabric.Triangle({ width: 100, height: 100, fill: selectedColor.value, left: 150, top: 50 });
  } else if (type === "text") {
    showTextDialog.value = true;
  }

  if (shape) {
    shape.set({ selectable: true });
    canvas.value.add(shape);
    canvas.value.renderAll();
    saveCanvasState();
  }
};

const handleTextApply = ({ text, color, fontSize, fontFamily, fontWeight, fontStyle }) => {
  const textbox = new fabric.Textbox(text, {
    left: 250,
    top: 150,
    width: 300,
    fontSize: fontSize, 
    fontFamily: fontFamily ,
    fill: color,  
    fontWeight: fontWeight,  
    fontStyle: fontStyle,  
    hasControls: true,
    hasBorders: true,
  });

  textbox.set({ selectable: true });
  canvas.value.add(textbox);
  canvas.value.renderAll();
  saveCanvasState();
  showTextDialog.value = false;
};

const zoomIn = () => {
  zoomLevel.value += 0.1;
  canvas.value.setZoom(zoomLevel.value);
  saveCanvasState();
};

const zoomOut = () => {
  zoomLevel.value -= 0.1;
  if (zoomLevel.value < 0.2) zoomLevel.value = 0.2;
  canvas.value.setZoom(zoomLevel.value);
  saveCanvasState();
};

const editSelected = () => {
  const activeObject = canvas.value.getActiveObject();
  if (activeObject) {
    activeObject.set({ stroke: "yellow", strokeWidth: 5 });
    canvas.value.renderAll();
    saveCanvasState();
  }
};

const deleteSelected = () => {
  const activeObject = canvas.value.getActiveObject();
  if (activeObject) {
    canvas.value.remove(activeObject);
    canvas.value.discardActiveObject();
    canvas.value.requestRenderAll();
    isObjectSelected.value = false;
    saveCanvasState();
  }
};
</script>

<style scoped>
.v-btn {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid black;
  margin: 0px 12px;
}

.v-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.v-row {
  margin-top: 20px;
}

.v-col {
  display: flex;
  justify-content: center;
}

.color-picker-container {
  margin-top: 20px;
  text-align: center;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input[type="color"] {
  width: 50px;
  height: 50px;
  border: none;
  cursor: pointer;
}
</style>
