<template>
  <v-app>
    <v-app-bar color="black lighten-4">
      <v-toolbar-title class="text-h4" style="color: white">Collabie</v-toolbar-title>

      <!-- Undo Button -->
      <v-btn @click="undoAction" icon>
        <v-icon>mdi-undo</v-icon>
      </v-btn>

      <!-- Redo Button -->
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

    
            <v-list-item @click="createNewDesign">
              <v-btn outlined icon>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-list-item-content>
                <v-list-item-title>New Design</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

       
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
import { ref, onMounted } from "vue";
import { useGlobalCanvas } from "../composables/globalCanvas";
import elementsPage from "../components/elementsPage.vue";
import drawingComponent from "../components/drawingComponent.vue";

 
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

  // Check for previously saved designs in localStorage
  const savedDesign = localStorage.getItem("savedDesign");
  if (savedDesign) {
    canvas.value.loadFromJSON(JSON.parse(savedDesign), () => {
      canvas.value.renderAll();
      console.log("Canvas loaded from saved design.");
    });
  } else {
    console.log("No saved design found.");
  }

  // Event listeners for canvas interactions
  initializedCanvas.on("object:added", () => {
    if (canvas.value.isDrawingMode) {
      switchToSelectionMode();  // Switch to selection mode after drawing
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

  // Set initial drawing mode and cursor
  canvas.value.isDrawingMode = false;
  setCanvasCursor();

  // Set up canvas state saving on changes
  initializedCanvas.on("object:added", saveCanvasState);
  initializedCanvas.on("object:modified", saveCanvasState);
  initializedCanvas.on("object:removed", saveCanvasState);
});

// Save the canvas state to localStorage for undo/redo functionality
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

// Toggle the elements menu for adding shapes to canvas
const toggleShapesMenu = () => {
  showShapesMenu.value = !showShapesMenu.value;
};

// Apply drawing settings like color and brush width
const handleDrawingSettings = (settings) => {
  canvas.value.isDrawingMode = true;
  canvas.value.freeDrawingBrush.color = settings.color;
  canvas.value.freeDrawingBrush.width = settings.weight;
  setCanvasCursor();
};

// Toggle drawing mode on/off
const toggleDrawingMode = () => {
  isDrawingMode.value = !isDrawingMode.value;
  canvas.value.isDrawingMode = isDrawingMode.value;
  setCanvasCursor();
  setCanvasSelectionState();
};

// Set canvas cursor based on the drawing mode
const setCanvasCursor = () => {
  canvas.value.defaultCursor = canvas.value.isDrawingMode
    ? "crosshair"
    : "default";
};

// Set canvas selection state when switching between drawing and selection mode
const setCanvasSelectionState = () => {
  canvas.value.selection = !canvas.value.isDrawingMode;
};

// Switch to selection mode (used after drawing)
const switchToSelectionMode = () => {
  canvas.value.isDrawingMode = false;
  setCanvasCursor();
  setCanvasSelectionState();
};

// Add a shape to the canvas
const addShapeToCanvas = (shape) => {
  if (canvas.value && shape) {
    canvas.value.add(shape);
    shape.set({ selectable: true });
    canvas.value.renderAll();
    saveCanvasState();  // Save state after adding shape
  }
};

// Undo the last action on the canvas
const undoAction = () => {
  if (undoStack.value.length > 1) {
    const lastState = undoStack.value.pop();  // Remove last state from undo stack
    redoStack.value.push(lastState);  // Push it to redo stack
    const prevState = undoStack.value[undoStack.value.length - 1];  // Get previous state
    canvas.value.loadFromJSON(prevState, () => {
      canvas.value.renderAll();  // Render canvas with previous state
    });
  }
};

// Redo the last undone action
const redoAction = () => {
  if (redoStack.value.length > 0) {
    const state = redoStack.value.pop();  // Remove last state from redo stack
    undoStack.value.push(state);  // Push it to undo stack
    canvas.value.loadFromJSON(state, () => {
      canvas.value.renderAll();  // Render canvas with the redone state
    });
  }
};

// Trigger the image upload dialog
const triggerImageUpload = () => {
  imageInput.value.click();
};

// Handle image file selection and add it to the canvas
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) {
    console.warn("No file selected");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const imageDataUrl = e.target.result;
    console.log("Image loaded as Data URL:", imageDataUrl);

    fabric.Image.fromURL(imageDataUrl, (img) => {
      if (!img) {
        console.error("fabric.Image failed to create image");
        return;
      }

      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
        hasControls: true,
        hasBorders: true,
      });

      if (canvas.value) {
        canvas.value.add(img);
        canvas.value.renderAll();
        saveCanvasState();  // Save state after adding the image
        console.log("Image added to canvas.");
      } else {
        console.error("Canvas is not initialized.");
      }
    });
  };

  reader.readAsDataURL(file);
};

// Upload the current canvas state 
const uploadCanvas = () => {
  const json = canvas.value.toJSON();
  console.log("Canvas JSON:", json);

  if (json.objects.length === 0) {
    alert("No objects on the canvas to upload!");
    return;
  }
  saveCanvasState();  // Save state before uploading
  const storedDesigns = JSON.parse(localStorage.getItem("savedDesigns")) || [];
  storedDesigns.push(json);  // Store the current design
  localStorage.setItem("savedDesigns", JSON.stringify(storedDesigns));

  savedDesigns.value = storedDesigns;
  canvas.value.clear();  // Clear canvas after upload
  isObjectSelected.value = false;
};

// Download the canvas as an image
const downloadCanvas = () => {
  const dataURL = canvas.value.toDataURL({
    format: "png",
    quality: 1,
  });
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "my-canvas.png";  // Set default download name
  link.click();
};

// Function to create a new project  
const createNewDesign = () => {
  canvas.value.clear();  
  undoStack.value = [];  
  redoStack.value = [];  
  localStorage.removeItem("savedDesign"); 
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
