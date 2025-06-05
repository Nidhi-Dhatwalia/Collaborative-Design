import { ref } from 'vue'; 

export function useImageUtils(canvas) {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && canvas.value) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const fabricImage = new fabric.Image(img, {
            left: 50,
            top: 50,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });

          canvas.value.add(fabricImage);
          canvas.value.renderAll();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.click();
    inputElement.addEventListener('change', handleImageUpload);
  };

  const saveCanvasAsImage = () => {
    if (canvas.value) {
      const dataUrl = canvas.value.toDataURL({
        format: 'png',
        quality: 1,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'canvas-design.png';
      link.click();
    } else {
      console.error('Canvas is not initialized yet!');
    }
  };


    const addVideoToCanvas = (videoSrc) => {
    if (!canvas.value) {
      console.error('Canvas is not initialized!');
      return;
    }

    const video = document.createElement('video');
    video.src = videoSrc;
    video.crossOrigin = 'anonymous';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.play();

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const fabricVideoImage = new fabric.Image(tempCanvas, {
      left: 100,
      top: 100,
      selectable: false,
    });

    video.addEventListener('loadeddata', () => {
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;

      const updateFrame = () => {
        tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
        fabricVideoImage.setElement(tempCanvas);
        fabricVideoImage.dirty = true;
        canvas.value.renderAll();
        requestAnimationFrame(updateFrame);
      };

      updateFrame();
      canvas.value.add(fabricVideoImage);
    });
  };


  return { handleImageUpload, triggerImageUpload, saveCanvasAsImage ,    addVideoToCanvas,};
}
