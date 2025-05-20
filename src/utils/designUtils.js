import { ref } from 'vue';  

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
  
export const useDesignUtils = () => {
  const savedDesigns = ref([]);

  const upload = (canvas) => {
    uploadCanvas(canvas, savedDesigns);
  };

 

  return {
    savedDesigns,
    upload, 
  };
};
