 <template>
  <v-app>
    <v-app-bar color="black lighten-4">
      <v-toolbar-title class="text-h4" style="color: white">Collabie </v-toolbar-title>
      
    </v-app-bar>
    <v-main>
      <input
        type="file"
        ref="imageInput"
        @change="handleImageUpload"
        style="display: none"
        accept="image/*"
      />
      <v-container fluid class="d-flex pa-0">
        <v-navigation-drawer width="150" color="white">
          <v-list dense nav>
            <template v-for="(item, index) in iconsList" :key="index">
            <router-link v-if="item.actionType === 'route'" :to="item.action">
              <v-list-item>
                <v-btn outlined icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-btn>
                <v-list-item-title>{{ item.label }}</v-list-item-title>
              </v-list-item>
            </router-link>
            <v-list-item v-else @click="() => handleAction(item)">
              <v-btn outlined icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-btn>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </template>
          </v-list>
        </v-navigation-drawer>

        <v-navigation-drawer width="100">
          <elementsPage v-if="showShapesMenu" />
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
import { ref, onMounted } from 'vue';
import { db } from '../firebase';
import { useGlobalCanvas } from '@/composables/globalCanvas';
import { useCanvasUtils } from '@/utils/canvasUtils';
import { useDesignUtils } from '@/utils/designUtils';
import { useDrawingUtils } from '@/utils/drawingUtils';
import { useImageUtils } from '../utils/imageUtils';
import elementsPage from '../components/elementsPage.vue';
import drawingComponent from '../components/drawingComponent.vue';
import { ref as firebaseRef, set, onValue } from 'firebase/database';



const syncCanvasWithFirebase = (canvasState) => {
  if (isDataLoadingFromFirebase) return;
  const canvasRef = firebaseRef(db, 'canvasDesigns');

  // console.log("canvasRef",canvasRef)
  
  set(canvasRef, canvasState)
    .then(() => console.log('Canvas data saved to Firebase.'))
    .catch((error) => console.error('Firebase save error:', error));
};



const loadCanvasFromFirebase = () => {
  const canvasRef = firebaseRef(db, 'canvasDesigns');
  onValue(canvasRef, (snapshot) => {
    if (snapshot.exists()) {
      isDataLoadingFromFirebase = true;   

      const canvasData = snapshot.val();


       console.log("canvasData",canvasData);


       

      // Remove listeners
      canvas.value.off('object:added');
      canvas.value.off('object:modified');
      canvas.value.off('object:removed');

      // Load JSON
      canvas.value.loadFromJSON(canvasData, () => {
        canvas.value.renderAll();

       
        setTimeout(() => {
    canvas.value.on('object:added', saveCanvasState);
    canvas.value.on('object:modified', saveCanvasState);
    canvas.value.on('object:removed', saveCanvasState);
    isDataLoadingFromFirebase = false;
  }, 100);  
        
      });
    }
  });
};



const saveCanvasState = () => {
  if (!canvas.value || isDataLoadingFromFirebase) return;

  const canvasState = canvas.value.toJSON();
  syncCanvasWithFirebase(canvasState);
};

 
const { canvas, initCanvas } = useGlobalCanvas(); 
const { uploadCanvas, createNew } = useDesignUtils();
const { toggleMode, drawingMode, applySettings } = useDrawingUtils();
const {
  triggerImageUpload,
  saveCanvasToLocalStorage,
  saveCanvasAsImage
} = useImageUtils(canvas, saveCanvasState);

const savedDesigns = ref([]);
const showShapesMenu = ref(false);
const isDrawingMode = ref(false);
const imageInput = ref(null);

let isDataLoadingFromFirebase = false;


const toggleShapesMenu = () => showShapesMenu.value = !showShapesMenu.value;

const downloadCanvas = () => {
  const dataUrl = canvas.value.toDataURL({ format: 'png', quality: 1 });
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'canvas-design.png';
  link.click();
};

const createNewDesign = () => {
  canvas.value.off('object:added');
  canvas.value.off('object:modified');
  canvas.value.off('object:removed');
  canvas.value.clear();
  syncCanvasWithFirebase(canvas.value.toJSON());
  localStorage.removeItem("savedDesign");
  canvas.value.on('object:added', saveCanvasState);
  canvas.value.on('object:modified', saveCanvasState);
  canvas.value.on('object:removed', saveCanvasState);
};

const toggleDrawingModeHandler = () => {
  toggleMode(canvas.value, setCanvasCursor);
  isDrawingMode.value = !isDrawingMode.value;
};


const handleDrawingSettings = (settings) => applySettings(canvas.value, settings);

const upload = () => {
  canvas.value.off('object:added');
  canvas.value.off('object:modified');
  canvas.value.off('object:removed');
  const designData = canvas.value.toJSON();
  const localDesigns = JSON.parse(localStorage.getItem('savedDesigns')) || [];
  localDesigns.push(designData);
  localStorage.setItem('savedDesigns', JSON.stringify(localDesigns));
  canvas.value.clear();
  canvas.value.on('object:added', saveCanvasState);
  canvas.value.on('object:modified', saveCanvasState);
  canvas.value.on('object:removed', saveCanvasState);
};

const actions = {
  createNewDesign,
  toggleShapesMenu,
  toggleDrawingModeHandler,
  downloadCanvas,
  triggerImageUpload,
  upload,
};

onMounted(() => {
  const initializedCanvas = initCanvas();
  canvas.value = initializedCanvas;

  initializedCanvas.on('mouse:up', () => {
  if (initializedCanvas.isDrawingMode) {
    initializedCanvas.isDrawingMode = false;
    setCanvasCursor();
    setCanvasSelectionState();
  }
});
  
  loadCanvasFromFirebase();
  
  initializedCanvas.on('after:render', () => canvas.value.isInitialized = true);
  initializedCanvas.on('object:added', saveCanvasState);
  initializedCanvas.on('object:modified', saveCanvasState);
  initializedCanvas.on('object:removed', saveCanvasState);
  
});

const setCanvasCursor = () => canvas.value.defaultCursor = canvas.value.isDrawingMode ? 'crosshair' : 'default';
const setCanvasSelectionState = () => canvas.value.selection = !canvas.value.isDrawingMode;

const handleAction = (item) => {
  if (item.actionType === 'function' && typeof item.action === 'function') item.action();
};

const iconsList = ref([
  { icon: 'mdi-home', label: 'Home', actionType: 'route', action: '/dashboard' },
  { icon: 'mdi-plus', label: 'New Design', actionType: 'function', action: createNewDesign },
  { icon: 'mdi-shape-outline', label: 'Elements', actionType: 'function', action: toggleShapesMenu },
  { icon: 'mdi-pencil', label: 'Draw', actionType: 'function', action: toggleDrawingModeHandler },
  { icon: 'mdi-cloud-upload', label: 'Upload', actionType: 'function', action: upload },
  { icon: 'mdi-image', label: 'Media', actionType: 'function', action: triggerImageUpload },
  { icon: 'mdi-content-save', label: 'Saved Designs', actionType: 'route', action: '/save' },
  { icon: 'mdi-download', label: 'Download', actionType: 'function', action: downloadCanvas },
]);
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