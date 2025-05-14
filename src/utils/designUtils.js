import { ref } from 'vue';
import * as fabric from "fabric"; 

const uploadCanvas = (canvas, savedDesigns) => {
  const json = canvas.toJSON();
  console.log("Canvas JSON:", json);

  if (json.objects.length === 0) {
    alert("No objects on the canvas to upload!");
    return;
  }

  const storedDesigns = JSON.parse(localStorage.getItem("savedDesigns")) || [];

  storedDesigns.push(json);

  localStorage.setItem("savedDesigns", JSON.stringify(storedDesigns));

  savedDesigns.value = storedDesigns;

  canvas.clear();
};

const downloadCanvas = (canvas) => {
  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1,
  });

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "my-canvas.png";
  link.click();
};

export const useDesignUtils = () => {
  const savedDesigns = ref([]);

  const upload = (canvas) => {
    uploadCanvas(canvas, savedDesigns);
  };

  const download = (canvas) => {
    downloadCanvas(canvas);
  };

  return {
    savedDesigns,
    upload,
    download,
  };
};
