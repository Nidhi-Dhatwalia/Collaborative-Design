import { ref } from 'vue';

const saveCanvasState = (canvas) => {
  if (!canvas) return;
  const currentState = canvas.toJSON();
  localStorage.setItem("savedDesign", JSON.stringify(currentState));
};

const loadCanvasState = (canvas) => {
  if (!canvas) return;
  const savedState = localStorage.getItem("savedDesign");
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    canvas.loadFromJSON(parsedState, () => {
      canvas.renderAll();
    });
  }
};

// Create an undo/redo utility
export function useCanvasManager(canvasRef) {
  // Stack for history
  const history = ref([]);
  const currentIndex = ref(-1); // Index for the current state

  // Function to save canvas state
  const saveCanvas = () => {
    if (!canvasRef.value) {
      console.warn("Canvas not initialized.");
      return;
    }

    const state = canvasRef.value.toJSON();
    if (currentIndex.value < history.value.length - 1) {
      // Clear the history if we are in the middle of undo/redo
      history.value.splice(currentIndex.value + 1);
    }

    history.value.push(state);
    currentIndex.value = history.value.length - 1;
    console.log('Canvas state saved:', state);
  };

  // Undo functionality
  const undo = () => {
    if (currentIndex.value <= 0) {
      console.log('No more states to undo.');
      return;
    }

    currentIndex.value -= 1;
    const previousState = history.value[currentIndex.value];
    canvasRef.value.loadFromJSON(previousState, () => {
      canvasRef.value.renderAll();
      console.log('Undo to previous state:', previousState);
    });
  };

  // Redo functionality
  const redo = () => {
    if (currentIndex.value >= history.value.length - 1) {
      console.log('No more states to redo.');
      return;
    }

    currentIndex.value += 1;
    const nextState = history.value[currentIndex.value];
    canvasRef.value.loadFromJSON(nextState, () => {
      canvasRef.value.renderAll();
      console.log('Redo to next state:', nextState);
    });
  };

  // Function to download canvas as PNG
  const download = () => {
    if (!canvasRef.value) {
      console.warn("Canvas not initialized.");
      return;
    }
    const dataUrl = canvasRef.value.toDataURL({ format: "png", quality: 1 });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "canvas-design.png";
    link.click();
  };

  // Save current canvas to localStorage
  const save = () => {
    if (!canvasRef.value) {
      console.warn("Canvas not initialized.");
      return;
    }
    // Save current canvas JSON to localStorage array
    const designData = canvasRef.value.toJSON();
    const localDesigns = JSON.parse(localStorage.getItem("savedDesigns")) || [];
    localDesigns.push(designData);
    localStorage.setItem("savedDesigns", JSON.stringify(localDesigns));
  };

  // Load canvas state from localStorage
  const load = () => {
    if (!canvasRef.value) {
      console.warn("Canvas not initialized.");
      return;
    }
    loadCanvasState(canvasRef.value);
  };

  return {
    download,
    save,
    load,
    saveCanvas, // Expose to save canvas state to history
    undo,       // Expose undo functionality
    redo,       // Expose redo functionality
  };
}
