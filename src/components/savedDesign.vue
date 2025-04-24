<template>
  <v-container class="saved-designs" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <h3>Saved Designs</h3>
        <p v-if="savedDesigns.length === 0" class="no-designs">
          No saved designs yet. Create some on the Canvas page.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="design-preview">
      <v-col cols="12" md="10">
        <v-card elevation="3" class="pa-3">
          <canvas id="preview-canvas" width="750" height="550"></canvas>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-for="(design, index) in savedDesigns" :key="index" justify="center" class="mb-4">
      <v-col cols="auto">
        <v-btn color="primary" @click="loadDesign(design)">
          Load Design {{ index + 1 }}
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="error" @click="deleteDesign(index)">
          Delete Design {{ index + 1 }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center"> 
      <v-col cols="auto" v-if="isModified">
        <v-btn color="secondary" @click="saveCurrentDesign">
          Save Current Design
        </v-btn>
      </v-col>

      <v-btn color="success" @click="$router.push('/canvas')">
        Back to Canvas
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

let canvasInstance = null
const savedDesigns = ref([])
const isModified = ref(false) // Track if the design is modified

onMounted(() => {
  const canvasElement = document.getElementById('preview-canvas')
  if (canvasElement) {
    canvasInstance = new fabric.Canvas(canvasElement)
 
    canvasInstance.on('object:modified', () => {
      isModified.value = true 
    })
    canvasInstance.on('object:added', () => {
      isModified.value = true  
    })
    canvasInstance.on('object:removed', () => {
      isModified.value = true  
    })
  }

  const storedDesigns = JSON.parse(localStorage.getItem('savedDesigns')) || []
  savedDesigns.value = storedDesigns
})

const loadDesign = (design) => {
  if (canvasInstance) {
    canvasInstance.clear()
    canvasInstance.loadFromJSON(design, () => {
      canvasInstance.renderAll()
      fitCanvasToViewport()
    })
  }
}

const deleteDesign = (index) => {
  savedDesigns.value.splice(index, 1)
  localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns.value))
}

const fitCanvasToViewport = () => {
  const canvasElement = document.getElementById('preview-canvas')
  canvasElement.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })

  if (canvasInstance) {
    const scale = 1
    canvasInstance.setZoom(scale)
  }
}

 
const saveCurrentDesign = () => {
  if (canvasInstance) {
    const currentDesign = JSON.stringify(canvasInstance.toJSON())
    savedDesigns.value.push(currentDesign)
    localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns.value))
    isModified.value = false  
  }
}
</script>

<style scoped>
.saved-designs {
  padding-top: 30px;
}

h3 {
  font-size: 32px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 16px;
}

.no-designs {
  font-style: italic;
  color: #757575;
}

canvas {
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  max-width: 100%;
  height: auto;
}
</style>
