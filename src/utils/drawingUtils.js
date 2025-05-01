import { ref } from 'vue';

// Function to handle drawing mode settings
const handleDrawingSettings = (canvas, settings) => {
  if (!settings) {
    console.warn("No drawing settings provided.");
    return;
  }

  if (!canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  }

  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = settings.color || '#000000';
  canvas.freeDrawingBrush.width = settings.weight || 2;
  setCanvasCursor(canvas);
};

// Function to toggle drawing mode
const toggleDrawingMode = (canvas, setCanvasCursor) => {
  canvas.isDrawingMode = !canvas.isDrawingMode; 
  setCanvasCursor(canvas); 
  setCanvasSelectionState(canvas, canvas.isDrawingMode); 
};

const setCanvasCursor = (canvas) => {
  canvas.defaultCursor = canvas.isDrawingMode ? "crosshair" : "default";
};

const setCanvasSelectionState = (canvas, isDrawingMode) => {
  canvas.selection = !isDrawingMode;
};

 
export const useDrawingUtils = () => {
  const drawingMode = ref(false);  

  const applySettings = (canvas, settings) => {
    handleDrawingSettings(canvas, settings);
  };

  const toggleMode = (canvas, setCanvasCursor) => {
    toggleDrawingMode(canvas, setCanvasCursor);
    drawingMode.value = !drawingMode.value;
  };

  return {
    drawingMode,
    applySettings,
    toggleMode,
  };
};
