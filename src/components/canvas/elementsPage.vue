<template>
  <v-container>
    <div class="toolbar-wrapper"> 
     <div class="icon-toolbar" >
    <v-row class="pa-0 ma-0" justify="center" align="center" wrap>
      <v-col
        cols="auto"
        class="mx-1 my-1"
        v-for="btn in shapeButtons"
        :key="btn.type"
        :style="{ color: btn.color }"
      >
       
          <v-icon @click="createShape(btn.type)" class="custom-icon-btn" size="25"  :style="{  color: btn.color, backgroundColor: btn.bgColor, }" >{{ btn.icon }}</v-icon>
      </v-col>
  
      <v-col
        cols="auto"
        class="mx-1 my-1"
        v-for="btn in zoomButtons"
        :key="btn.action"
      >
         
          <v-icon  @click="btn.action === 'in' ? zoomIn() : zoomOut()" class="custom-icon-btn" size="25"  :style="{  color: btn.color, backgroundColor: btn.bgColor, }" >{{ btn.icon }}</v-icon>
     
      </v-col>
    </v-row>

     </div>
    </div> 
  </v-container>

  <div v-show="isObjectSelected" class="color-picker-container">
    <input type="color" v-model="selectedColor" @input="updateColor" />
  </div>

  <div class="button-container" v-show="isObjectSelected">
    <v-btn icon @click="deleteSelected" class="custom-icon-btn">
      <v-icon size="24">mdi-delete</v-icon>
    </v-btn>
    <v-btn icon @click="editSelected" class="custom-icon-btn">
      <v-icon size="24">mdi-pencil</v-icon>
    </v-btn>
  </div>

  <v-dialog v-model="showTextDialog" max-width="500px">
    <textSettings @apply="handleTextApply" @close="showTextDialog = false" />
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useGlobalCanvas } from '@/composables/globalCanvas'
import textSettings from '../canvas/textSettings.vue'

const { canvas, initCanvas } = useGlobalCanvas()

const selectedColor = ref('#000000')
const isObjectSelected = ref(false)
const showTextDialog = ref(false)
const isDrawingMode = ref(false)

const shapeButtons = [
  { type: 'rectangle', icon: 'mdi-rectangle',   color: '#992bff'},
  { type: 'circle', icon: 'mdi-circle' ,color: '#ff3b4b' },
  { type: 'triangle', icon: 'mdi-triangle',  color: '#138eff' },
  { type: 'text', icon: 'mdi-format-text',   color: '#0ba84a' }
]

const zoomButtons = [
  { action: 'in', icon: 'mdi-magnify-plus' ,color: '#11171d' },
  { action: 'out', icon: 'mdi-magnify-minus', color: '#11171d'  }
]

const saveCanvasState = () => {
  try {
    const currentState = canvas.value.toJSON()
    localStorage.setItem('savedDesign', JSON.stringify(currentState))
  } catch (error) {
    console.error('Error saving canvas state:', error)
  }
}

onMounted(() => {
  initCanvas()

  canvas.value.on('selection:created', () => { isObjectSelected.value = true })
  canvas.value.on('selection:updated', () => { isObjectSelected.value = true })
  canvas.value.on('selection:cleared', () => { isObjectSelected.value = false })

  canvas.value.on('mouse:wheel', (opt) => {
    const delta = opt.e.deltaY
    delta > 0 ? zoomOut() : zoomIn()
    opt.e.preventDefault()
    opt.e.stopPropagation()
  })
})

watch(selectedColor, (newColor) => {
  const activeObject = canvas.value.getActiveObject()
  if (activeObject) {
    activeObject.set({ fill: newColor })
    canvas.value.renderAll()
    saveCanvasState()
  }
})

const findEmptyPosition = (width, height) => {
  const margin = 20
  const canvasWidth = canvas.value.width
  const canvasHeight = canvas.value.height
  let x, y
  let overlap = true
  let attempts = 0
  while (overlap && attempts < 100) {
    x = Math.random() * (canvasWidth - width - margin)
    y = Math.random() * (canvasHeight - height - margin)
    overlap = canvas.value.getObjects().some(obj => (
      x < obj.left + obj.width + margin &&
      x + width + margin > obj.left &&
      y < obj.top + obj.height + margin &&
      y + height + margin > obj.top
    ))
    attempts++
  }
  if (attempts >= 100) return
  return { x, y }
}

const createShape = (type) => {
  if (!canvas.value) return
  let shape = null
  let position = { x: 50, y: 50 }
  if (type !== 'text') position = findEmptyPosition(100, 100) || { x: 50, y: 50 }
  if (type === 'rectangle') {
    shape = new fabric.Rect({
      width: 100, height: 100, fill: selectedColor.value,
      left: position.x, top: position.y, selectable: true
    })
  } else if (type === 'circle') {
    shape = new fabric.Circle({
      radius: 50, fill: selectedColor.value,
      left: position.x, top: position.y, selectable: true
    })
  } else if (type === 'triangle') {
    shape = new fabric.Triangle({
      width: 100, height: 100, fill: selectedColor.value,
      left: position.x, top: position.y, selectable: true
    })
  } else if (type === 'text') {
    showTextDialog.value = true
  }
  if (shape) {
    canvas.value.add(shape)
    canvas.value.renderAll()
      disableDrawingMode(),
    saveCanvasState()
  }
}

const handleTextApply = ({ text, color, fontSize, fontFamily, fontWeight, fontStyle, textBaseline }) => {
  const validTextBaseline = ['alphabetic', 'middle', 'ideographic']
  const finalTextBaseline = validTextBaseline.includes(textBaseline) ? textBaseline : 'alphabetic'
  if (!text || !color || !fontSize || !fontFamily) return
  const textbox = new fabric.Textbox(text, {
    left: 250, top: 150, width: 300,
    fontSize, fontFamily, fill: color,
    fontWeight, fontStyle, textBaseline: finalTextBaseline,
    hasBorders: true, hasControls: true, selectable: true
  })
  canvas.value.add(textbox)
  canvas.value.renderAll()
  saveCanvasState()
  showTextDialog.value = false
}

const zoomObject = (scaleFactor) => {
  const activeObject = canvas.value.getActiveObject()
  if (activeObject) {
    activeObject.scaleX *= scaleFactor
    activeObject.scaleY *= scaleFactor
    activeObject.setCoords()
    canvas.value.renderAll()
    saveCanvasState()
  }
}

const zoomIn = () => zoomObject(1.1)
const zoomOut = () => zoomObject(0.9)

const editSelected = () => {
  const activeObject = canvas.value.getActiveObject()
  if (activeObject) {
    activeObject.set({ stroke: 'black', strokeWidth: 2 })
    canvas.value.renderAll()
    saveCanvasState()
  }
}

const deleteSelected = () => {
  const activeObject = canvas.value.getActiveObject()
  if (activeObject) {
    canvas.value.remove(activeObject)
    canvas.value.discardActiveObject()
    canvas.value.requestRenderAll()
    isObjectSelected.value = false
    saveCanvasState()
  }
}

const updateColor = (event) => {
  selectedColor.value = event.target.value
}


const disableDrawingMode = () => {
  if (!canvas.value) return;

  canvas.value.isDrawingMode = false;
  isDrawingMode.value = false;
  canvas.value.defaultCursor = "default";  
};
</script>

<style scoped>
.toolbar-wrapper {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close-btn {
  background-color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.icon-toolbar {
  background-color: white;
  border-radius: 30px;
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.icon-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.icon-button:hover {
  transform: scale(1.3);
}

.custom-icon-btn {  
  transition: 0.3s ease;
 
}

.custom-icon-btn:hover {
  transform: scale(1.2);
}

.v-row {
  margin-top: 20px;
}

.color-picker-container {
  margin: 20px auto;
  text-align: center;
  max-width: 200px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px auto;
  flex-wrap: wrap;
  max-width: 300px;
}

input[type='color'] {
  width: 40px;
  height: 40px;
  border: none;
  cursor: pointer;
  padding: 0;
}

@media (max-width: 600px) {
  .custom-icon-btn {
    min-width: 36px;
    min-height: 36px;
    padding: 6px;
  }

  .color-picker-container {
    max-width: 100%;
  }

  .button-container {
    flex-direction: column;
    max-width: 100%;
    gap: 8px;
  }

  input[type='color'] {
    width: 36px;
    height: 36px;
  }
}
</style>
