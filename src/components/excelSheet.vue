<template>
  <v-app>
    <sideBar />
    <v-container fluid class="pa-0">
      <div class="toolbar">
        <h2 class="text-h5 font-weight-bold">Excel Style Sheet</h2>
        <v-btn color="primary" @click="saveToLocalStorage">Save</v-btn>
      </div>

      <div class="excel-wrapper">
        <!-- Column Headers -->
        <div class="row header-row">
          <div class="cell row-header"></div>
          <div class="cell col-header" v-for="col in colLabels" :key="col">{{ col }}</div>
        </div>

        <!-- Main Grid -->
        <div class="row" v-for="(row, rowIndex) in rows" :key="rowIndex">
          <div class="cell row-header">{{ rowIndex + 1 }}</div>
          <div class="cell" v-for="(col, colIndex) in cols" :key="colIndex">
            <input
              type="text"
              v-model="sheetData[rowIndex][colIndex]"
              class="cell-input"
            />
          </div>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import sideBar from '../composables/sideBar.vue';

const colLabels = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
)

const rows = Array.from({ length: 50 })
const cols = Array.from({ length: 26 })

const defaultData = () =>
  Array.from({ length: 50 }, () => Array.from({ length: 26 }, () => ''))

const sheetData = ref(defaultData())

const STORAGE_KEY = 'excel-sheet-data'

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    sheetData.value = JSON.parse(saved)
  }
})

const saveToLocalStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sheetData.value))
  alert('Sheet saved!')
}
</script>

<style scoped>
html, body, .v-container {
  height: 100%;
  margin: 0;
  padding: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
}

.excel-wrapper {
  height: calc(100vh - 80px);
  overflow: auto;
  border: 1px solid #ccc;
}

.row {
  display: flex;
  min-width: max-content;
}

.cell {
  border: 1px solid #ccc;
  box-sizing: border-box;
  width: 140px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.cell-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  text-align: center;
}

.row-header {
  background-color: #f0f0f0;
  font-weight: bold;
  position: sticky;
  left: 0;
  z-index: 1;
}

.col-header {
  background-color: #e0e0e0;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 2;
}
</style>
