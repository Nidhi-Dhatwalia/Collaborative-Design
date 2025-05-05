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

  <!-- Color Picker for Object -->
  <div v-show="isObjectSelected" class="color-picker-container">
    <input type="color" v-model="selectedColor" @input="updateColor" />
  </div>

  <!-- Custom Context Menu -->
  <div v-if="showContextMenu" :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }" class="context-menu">
    <v-btn @click="deleteSelected">Delete</v-btn>
    <v-btn @click="editSelected">Edit</v-btn>
    <v-btn @click="resizeSelected">Resize</v-btn>
  </div>

  <!-- Text Dialog for Text Object -->
  <v-dialog v-model="showTextDialog" max-width="500px"> 
    <textSettings
      @apply="handleTextApply"
      @close="showTextDialog = false"
    /> 
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useGlobalCanvas } from "../composables/globalCanvas";
import textSettings from '../components/textSettings.vue';

const { canvas, initCanvas } = useGlobalCanvas();

const selectedColor = ref("#3734eb");
const isObjectSelected = ref(false);
const zoomLevel = ref(1);
const showTextDialog = ref(false);

const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });

onMounted(() => {
  const initializedCanvas = initCanvas();

  if (initializedCanvas) {
    // Handle object selection events
    initializedCanvas.on("selection:created", () => {
      isObjectSelected.value = true;
    });

    initializedCanvas.on("selection:updated", () => {
      isObjectSelected.value = true;
    });

    initializedCanvas.on("selection:cleared", () => {
      isObjectSelected.value = false;
    });

    // Handle right-click event
    initializedCanvas.on("mouse:down", (opt) => {
      if (opt.button === 3) {  // Right-click
        const pointer = canvas.value.getPointer(opt.e);
        const activeObject = canvas.value.getActiveObject();

        if (activeObject) {
          // Show context menu if an object is selected
          showContextMenu.value = true;
          contextMenuPosition.value = { x: pointer.x, y: pointer.y };
        } else {
          // Hide context menu if no object is selected
          showContextMenu.value = false;
        }
      }
    });
  } else {
    console.error("Canvas not initialized properly");
  }
});

// Function to create a shape
const createShape = (type) => {
  let shape = null;
  let position = { x: 50, y: 50 };

  if (type !== "text") {
    position = findEmptyPosition(100, 100);
  }

  if (type === "rectangle") {
    shape = new fabric.Rect({
      width: 100,
      height: 100,
      fill: selectedColor.value,
      left: position.x,
      top: position.y,
      selectable: true,
    });
  } else if (type === "circle") {
    shape = new fabric.Circle({
      radius: 50,
      fill: selectedColor.value,
      left: position.x,
      top: position.y,
      selectable: true,
    });
  } else if (type === "triangle") {
    shape = new fabric.Triangle({
      width: 100,
      height: 100,
      fill: selectedColor.value,
      left: position.x,
      top: position.y,
      selectable: true,
    });
  } else if (type === "text") {
    showTextDialog.value = true;
  }

  if (shape) {
    shape.set({ selectable: true });
    canvas.value.add(shape);
    canvas.value.renderAll();
  }
};

// Function to delete the selected object
const deleteSelected = () => {
  const activeObject = canvas.value.getActiveObject();
  if (activeObject) {
    canvas.value.remove(activeObject);
    canvas.value.discardActiveObject();
    canvas.value.requestRenderAll();
    showContextMenu.value = false;
  }
};

// Function to edit the selected object
const editSelected = () => {
  const activeObject = canvas.value.getActiveObject();
  if (activeObject) {
    activeObject.set({ stroke: "yellow", strokeWidth: 5 });
    canvas.value.renderAll();
  }
};

// Function to resize the selected object
const resizeSelected = () => {
  const activeObject = canvas.value.getActiveObject();
  if (activeObject) {
    activeObject.set({ scaleX: 1.2, scaleY: 1.2 });
    canvas.value.renderAll();
  }
};

// Handle text application in the dialog
const handleTextApply = ({ text, color, fontSize, fontFamily, fontWeight, fontStyle, textBaseline }) => {
  const textbox = new fabric.Textbox(text, {
    left: 250,
    top: 150,
    width: 300,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fill: color,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    textBaseline: textBaseline || 'alphabetic',
    hasBorders: true,
    hasControls: true,
  });

  textbox.set({ selectable: true });
  canvas.value.add(textbox);
  canvas.value.renderAll();
  showTextDialog.value = false;
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

.context-menu {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding: 10px;
}

.context-menu v-btn {
  display: block;
  margin: 5px 0;
}

input[type="color"] {
  width: 50px;
  height: 50px;
  border: none;
  cursor: pointer;
}
</style>
