import { ref } from 'vue'; 

const handleDrawingSettings = (canvas, settings) => {
  if (!settings) {
    console.warn("No drawing settings provided.");
    return;
  }

  // Create pencil brush if not already created
  if (!canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  }

  // Always attach path:created  
  if (!canvas.__drawingEventAttached) {
    canvas.on('path:created', (event) => {
  if (event && event.path) {
    event.path.set({
      fill: 'transparent',  
      stroke: canvas.freeDrawingBrush.color,
      strokeWidth: canvas.freeDrawingBrush.width,
    });

  
    event.path.fill = 'transparent';

    canvas.renderAll();
    console.log("Fixed fill:", event.path.fill);
  }
});

    canvas.__drawingEventAttached = true;
  }

  // Apply current settings
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = settings.color || 'black';
  canvas.freeDrawingBrush.width = settings.weight || 2;

  

  setCanvasCursor(canvas);
};

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
    console.log("Settings received:", settings.color, settings.weight);
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
