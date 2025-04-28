// utils/useCanvasUtils.js

import { ref } from 'vue';

// Canvas state management functions
const saveCanvasState = (canvas, undoStack, redoStack) => {
  const currentState = canvas.toJSON();
  if (
    undoStack.length === 0 ||
    JSON.stringify(undoStack[undoStack.length - 1]) !==
      JSON.stringify(currentState)
  ) {
    undoStack.push(currentState);
    redoStack.length = 0; // Clear redo stack
  }
  localStorage.setItem("savedDesign", JSON.stringify(currentState));
};

const undoAction = (canvas, undoStack, redoStack) => {
  if (undoStack.length > 1) {
    const lastState = undoStack.pop();
    redoStack.push(lastState);
    const prevState = undoStack[undoStack.length - 1];
    canvas.loadFromJSON(prevState, () => {
      canvas.renderAll();
    });
  }
};

const redoAction = (canvas, undoStack, redoStack) => {
  if (redoStack.length > 0) {
    const state = redoStack.pop();
    undoStack.push(state);
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
    });
  }
};

// useCanvasUtils hook
export const useCanvasUtils = () => {
  const undoStack = ref([]);
  const redoStack = ref([]);
  
  const saveState = (canvas) => {
    saveCanvasState(canvas, undoStack.value, redoStack.value);
  };

  const undo = (canvas) => {
    undoAction(canvas, undoStack.value, redoStack.value);
  };

  const redo = (canvas) => {
    redoAction(canvas, undoStack.value, redoStack.value);
  };

  return {
    undoStack,
    redoStack,
    saveState,
    undo,
    redo,
  };
};
