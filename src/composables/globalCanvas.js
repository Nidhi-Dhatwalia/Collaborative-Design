import { ref } from "vue";

const canvas = ref(null);

const initCanvas = (canvasId = "my-canvas") => {
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
