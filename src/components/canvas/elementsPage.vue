<template>
  <v-container class="pa-0" fluid>
    <!-- Main Toolbar -->
    <div class="toolbar-wrapper">
      <div class="icon-toolbar">
        <v-row class="pa-0 ma-0" justify="center" align="center" wrap>
          <!-- Shape Buttons -->
          <v-col
            cols="auto"
            class="mx-1 my-1"
            v-for="btn in shapeButtons"
            :key="btn.type"
          >
            <v-btn
              icon
              :style="{ color: btn.color, backgroundColor: btn.bgColor || 'transparent' }"
              @click="createShape(btn.type)"
              class="toolbar-btn"
              :title="btn.type.charAt(0).toUpperCase() + btn.type.slice(1)"
            >
              <v-icon size="28">{{ btn.icon }}</v-icon>
            </v-btn>
          </v-col>

          <!-- Zoom Buttons -->
          <v-col
            cols="auto"
            class="mx-1 my-1"
            v-for="btn in zoomButtons"
            :key="btn.action"
          >
            <v-btn
              icon
              :style="{ color: btn.color }"
              @click="btn.action === 'in' ? zoomIn() : zoomOut()"
              class="toolbar-btn"
              :title="btn.action === 'in' ? 'Zoom In' : 'Zoom Out'"
            >
              <v-icon size="28">{{ btn.icon }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Floating Controls -->
      <transition name="fade">
        <div v-if="isObjectSelected" class="floating-controls">
          <input
            type="color"
            v-model="selectedColor"
            @input="updateColor"
            class="color-picker"
            aria-label="Select fill color"
            title="Change Color"
          />
          <v-btn
            icon
            color="red"
            @click="deleteSelected"
            class="floating-btn"
            title="Delete Selected"
          >
            <v-icon size="26">mdi-delete</v-icon>
          </v-btn>
          <v-btn
            icon
            color="primary"
            @click="editSelected"
            class="floating-btn"
            title="Edit Selected"
          >
            <v-icon size="26">mdi-pencil</v-icon>
          </v-btn>
        </div>
      </transition>
    </div>

    <!-- Text dialog -->
    <v-dialog v-model="showTextDialog" max-width="500px">
      <textSettings @apply="handleTextApply" @close="showTextDialog = false" />
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGlobalCanvas } from '@/composables/globalCanvas'
import textSettings from '../canvas/textSettings.vue'

const { canvas, initCanvas } = useGlobalCanvas()

const selectedColor = ref(' #000000 ')
const isObjectSelected = ref(false)
const showTextDialog = ref(false)

const shapeButtons = [
  { type: 'rectangle', icon: 'mdi-rectangle', color: '#992bff' },
  { type: 'circle', icon: 'mdi-circle', color: '#ff3b4b' },
  { type: 'triangle', icon: 'mdi-triangle', color: '#138eff' },
  { type: 'text', icon: 'mdi-format-text', color: '#0ba84a' }
]

const zoomButtons = [
  { action: 'in', icon: 'mdi-magnify-plus', color: '#11171d' },
  { action: 'out', icon: 'mdi-magnify-minus', color: '#11171d' }
]

onMounted(() => {
  initCanvas()

  canvas.value.on('selection:created', () => {
    isObjectSelected.value = true
    const activeObj = canvas.value.getActiveObject()
    if (activeObj && activeObj.fill) selectedColor.value = activeObj.fill
  })

  canvas.value.on('selection:updated', () => {
    isObjectSelected.value = true
    const activeObj = canvas.value.getActiveObject()
    if (activeObj && activeObj.fill) selectedColor.value = activeObj.fill
  })

  canvas.value.on('selection:cleared', () => {
    isObjectSelected.value = false
  })

  canvas.value.on('mouse:wheel', (opt) => {
    const delta = opt.e.deltaY
    delta > 0 ? zoomOut() : zoomIn()
    opt.e.preventDefault()
    opt.e.stopPropagation()
  })
})

const createShape = (type) => {
  if (!canvas.value) return
  let shape = null
  const position = { x: 50, y: 50 }
  if (type === 'rectangle') {
    shape = new fabric.Rect({ width: 100, height: 100, fill: selectedColor.value, left: position.x, top: position.y, selectable: true })
  } else if (type === 'circle') {
    shape = new fabric.Circle({ radius: 50, fill: selectedColor.value, left: position.x, top: position.y, selectable: true })
  } else if (type === 'triangle') {
    shape = new fabric.Triangle({ width: 100, height: 100, fill: selectedColor.value, left: position.x, top: position.y, selectable: true })
  } else if (type === 'text') {
    showTextDialog.value = true
  }
  if (shape) {
    canvas.value.add(shape)
    canvas.value.renderAll()
    saveCanvasState()
  }
}

const handleTextApply = ({ text, color, fontSize, fontFamily, fontWeight, fontStyle, textBaseline }) => {
  if (!text) return
  const textbox = new fabric.Textbox(text, {
    left: 250,
    top: 150,
    width: 300,
    fontSize,
    fontFamily,
    fill: color,
    fontWeight,
    fontStyle,
    textBaseline,
    hasBorders: true,
    hasControls: true,
    selectable: true
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
  const activeObject = canvas.value.getActiveObject()
  if (activeObject) {
    activeObject.set({ fill: selectedColor.value })
    canvas.value.renderAll()
    saveCanvasState()
  }
}

const saveCanvasState = () => {
  try {
    const currentState = canvas.value.toJSON()
    localStorage.setItem('savedDesign', JSON.stringify(currentState))
  } catch (error) {
    console.error('Error saving canvas state:', error)
  }
}
</script>

<style scoped>
.toolbar-wrapper {
  position: absolute;
  top: 10px;
  left: 70%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center; 
  pointer-events: auto;
}

.icon-toolbar {
  background-color: #fff;
  border-radius: 32px;
  padding: 10px 20px;
  display: flex;
  gap:12px; 
  transition: box-shadow 0.3s ease;
}

 

.toolbar-btn {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.toolbar-btn:hover {
  transform: scale(1.2);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.floating-controls {
  margin-top: 12px;
  background-color: #fff; 
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  user-select: none;
  pointer-events: auto;
}

.color-picker {
  width: 40px;
  height: 40px;
  border: none;
  padding: 0;
  border-radius: 6px;
  cursor: pointer;
  transition: box-shadow 0.15s ease;
}

.color-picker:hover {
  box-shadow: 0 0 8px 3px rgba(0, 0, 0, 0.12);
}

.floating-btn {
  transition: transform 0.15s ease;
}

.floating-btn:hover {
  transform: scale(1.2);
}
 
 
</style>
