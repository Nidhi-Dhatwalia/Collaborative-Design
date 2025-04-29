import { ref } from "vue";

const canvas = ref(null);

const initCanvas = (canvasId = "my-canvas", width = 800, height = 600) => {
  if (!canvas.value) {
    canvas.value = new fabric.Canvas(canvasId, { selection: true });
  }
  return canvas.value;
};

export const useGlobalCanvas = () => {
  return {
    canvas,
    initCanvas
  };
};
