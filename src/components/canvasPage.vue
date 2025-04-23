<template>
  <v-app>
    <v-app-bar color="black lighten-4" dark flat>
      <v-toolbar-title class="text-h4" style="color: white"
        >Collabie</v-toolbar-title
      >
      <v-btn @click="undoAction" icon>
        <v-icon>mdi-undo</v-icon>
      </v-btn>
      <v-btn @click="redoAction" icon>
        <v-icon>mdi-redo</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="d-flex pa-0">
        <v-navigation-drawer width="150" color="white">
          <v-list dense nav>
            <router-link to="/">
              <v-list-item>
                <v-btn outlined icon>
                  <v-icon>mdi-home</v-icon>
                </v-btn>
                <v-list-item-content>
                  <v-list-item-title>Home</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </router-link>


            <v-list-item @click="toggleShapesMenu">
              <v-btn outlined icon>
                <v-icon>mdi-shape-outline</v-icon>
              </v-btn>
              <v-list-item-content>
                <v-list-item-title>Elements</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            
            <v-navigation-drawer app width="100" color="white">
              <div v-show="showShapesMenu">
                <elementsPage @shape-created="addShapeToCanvas" />
              </div>
            </v-navigation-drawer>

            <v-list-item @click="toggleDrawingMode">
              <v-btn outlined icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-list-item-content>
                <v-list-item-title>Draw</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="uploadCanvas">
              <v-btn outlined icon>
                <v-icon>mdi-cloud-upload</v-icon>
              </v-btn>
              <v-list-item-content>
                <v-list-item-title>Upload</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="triggerImageUpload">
              <v-btn outlined icon>
                <v-icon>mdi-image</v-icon>
              </v-btn>
              <v-list-item-content>
                <v-list-item-title>Media</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleImageUpload"
            />
            <router-link to="/save">
              <v-list-item>
                <v-btn outlined icon>
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <v-list-item-content>
                  <v-list-item-title>Saved Designs</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </router-link>
            <v-list-item @click="downloadCanvas">
              <v-btn outlined icon>
                <v-icon>mdi-download</v-icon>
              </v-btn>
              <v-list-item-content>
                <v-list-item-title>Download</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        
        <drawingComponent v-if="isDrawingMode" @applyDrawingSettings="handleDrawingSettings" />
 

        <div class="dashboard-container">
          <div class="canvas-wrapper">
            <canvas id="my-canvas" width="600" height="500"></canvas>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useGlobalCanvas } from "../composables/globalCanvas";
import elementsPage from "../components/elementsPage.vue";
import drawingComponent from '../components/drawingComponent.vue'

const { canvas, initCanvas } = useGlobalCanvas();
const savedDesigns = ref([]);
const isObjectSelected = ref(false);
const showShapesMenu = ref(false);
const undoStack = ref([]);
const redoStack = ref([]);
const imageInput = ref(null);
const isDrawingMode = ref(false);  
const dialog = ref(false);  



onMounted(() => {
  const initializedCanvas = initCanvas();
  canvas.value = initializedCanvas;

  initializedCanvas.on("object:added", () => { 
    if (canvas.value.isDrawingMode) {
      switchToSelectionMode();
    }
  });

  initializedCanvas.on("selection:created", () => { 
    if (!canvas.value.isDrawingMode) {
      console.log("Object selected");
    }
  });

  initializedCanvas.on("selection:cleared", () => { 
    console.log("Selection cleared");
  });

  canvas.value.isDrawingMode = false;
  setCanvasCursor();

  initializedCanvas.on("object:added", saveCanvasState);
  initializedCanvas.on("object:modified", saveCanvasState);
  initializedCanvas.on("object:removed", saveCanvasState);
});

const saveCanvasState = () => {
  const currentState = canvas.value.toJSON();
  if (
    undoStack.value.length === 0 ||
    JSON.stringify(undoStack.value[undoStack.value.length - 1]) !==
      JSON.stringify(currentState)
  ) {
    undoStack.value.push(currentState);
    redoStack.value = [];
  }
  localStorage.setItem("savedDesign", JSON.stringify(currentState));
};

const toggleShapesMenu = () => {
  showShapesMenu.value = !showShapesMenu.value;
};

 

const handleDrawingSettings = (settings) => {
  canvas.value.isDrawingMode = true;
  canvas.value.freeDrawingBrush.color = settings.color;
  canvas.value.freeDrawingBrush.width = settings.weight;
  setCanvasCursor();
};

const toggleDrawingMode = () => {
  isDrawingMode.value = !isDrawingMode.value;
  canvas.value.isDrawingMode = isDrawingMode.value;
  setCanvasCursor();
  setCanvasSelectionState();
};

const setCanvasCursor = () => {
  canvas.value.defaultCursor = canvas.value.isDrawingMode ? 'crosshair' : 'default';
};

const setCanvasSelectionState = () => {
  canvas.value.selection = !canvas.value.isDrawingMode;
};

const switchToSelectionMode = () => {
  canvas.value.isDrawingMode = false;
  setCanvasCursor();
  setCanvasSelectionState();
};

const addShapeToCanvas = (shape) => {
  if (canvas.value && shape) {
    canvas.value.add(shape);
    shape.set({ selectable: true });
    canvas.value.renderAll();
    saveCanvasState();
  }
};

const undoAction = () => {
  if (undoStack.value.length > 1) {
    const lastState = undoStack.value.pop();
    redoStack.value.push(lastState);
    const prevState = undoStack.value[undoStack.value.length - 1];
    canvas.value.loadFromJSON(prevState, () => {
      canvas.value.renderAll();
    });
  }
};

const redoAction = () => {
  if (redoStack.value.length > 0) {
    const state = redoStack.value.pop();
    undoStack.value.push(state);
    canvas.value.loadFromJSON(state, () => {
      canvas.value.renderAll();
    });
  }
};

const triggerImageUpload = () => {
  imageInput.value.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fabric.Image.fromURL(e.target.result, (img) => {
      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
        hasControls: true,
        hasBorders: true,
      });
      canvas.value.add(img);
      saveCanvasState();
    });
  };
  reader.readAsDataURL(file);
};

const uploadCanvas = () => {
  const json = canvas.value.toJSON();
  console.log("Canvas JSON:", json);

  if (json.objects.length === 0) {
    alert("No objects on the canvas to upload!");
    return;
  }
  saveCanvasState();
  const storedDesigns = JSON.parse(localStorage.getItem("savedDesigns")) || [];
  storedDesigns.push(json);
  localStorage.setItem("savedDesigns", JSON.stringify(storedDesigns));

  savedDesigns.value = storedDesigns;
  canvas.value.clear();
  isObjectSelected.value = false;
};

const loadDesign = () => {
  const savedDesigns = JSON.parse(localStorage.getItem("savedDesigns")) || [];

  if (savedDesigns.length > 0) {
    const latestDesign = savedDesigns[savedDesigns.length - 1];

    if (canvas.value) {
      canvas.value.loadFromJSON(latestDesign, () => {
        canvas.value.renderAll();
        console.log("Canvas loaded:", latestDesign);
      });
    }
  } else {
    console.log("No saved designs found.");
  }
};

const downloadCanvas = () => {
  const dataURL = canvas.value.toDataURL({
    format: "png",
    quality: 1,
  });
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "my-canvas.png";
  link.click();
};
</script>

<style scoped>
 

.v-list-item {
  border-radius: 8px;
  transition: background-color 0.2s ease; 
}
.v-list-item:hover {
  background-color: #f0f0ff;
}
.canvas-wrapper {
  border: 1px solid black;
margin-top: 40px;
}
.v-navigation-drawer {
  position: relative;
  margin: 20px 0px;
}
</style>
