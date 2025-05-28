<template>
  <div class="sheet-app">
    <header class="navbar">
      <router-link to="/home">
        <v-icon>mdi-arrow-left</v-icon>
      </router-link>
      <h1 class="title">Excel Data </h1>
    </header>

    <div class="content">
      <!-- Sidebar -->
      <aside class="sidebar">
        <h3>Load Sheets</h3>
        <div v-if="savedSheets.length === 0" class="no-sheets">No saved sheets found</div>
        <ul v-else>
          <li v-for="(sheet, index) in savedSheets" :key="sheet.key" class="sheet-item">
            <button class="load-btn" @click="loadSheet(sheet.key)">
            Excel Sheet   {{ index + 1 }}
            </button>
            <v-icon class="delete-btn" @click="deleteSheet(sheet.key)">mdi-delete</v-icon>
          </li>
        </ul>
      </aside>

      <!-- Sheet display -->
      <main class="sheet-wrapper">
        <div ref="hotContainer" class="hot-container"></div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";

const hotContainer = ref(null);
let hotInstance = null;

const savedSheets = ref([]);

// Fetch all saved sheets 
function fetchSavedSheets() {
  savedSheets.value = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("sheetData_")) {
      savedSheets.value.push({ key });
    }
  }
  savedSheets.value.sort((a, b) => (a.key < b.key ? 1 : -1)); // newest first
}

// Load sheet data into Handsontable
function loadSheet(key) {
  const data = JSON.parse(localStorage.getItem(key));
  if (data && hotInstance) {
    hotInstance.loadData(data);
  }
}

 
function deleteSheet(key) {
  localStorage.removeItem(key); 
  fetchSavedSheets();
   
}

onMounted(() => { 
  hotInstance = new Handsontable(hotContainer.value, {
    data: Handsontable.helper.createEmptySpreadsheetData(30, 20),
    rowHeaders: true,
    colHeaders: true,
    width: "100%",
    height: "calc(100vh - 64px)", 
    rowHeights: 30,
    colWidths: 100,
    licenseKey: "non-commercial-and-evaluation",
    readOnly: true,
  });

  fetchSavedSheets();
});
</script>

<style scoped>
.sheet-app {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  align-items: center;
  background-color: #1976d2;
  color: white;
  padding: 12px 24px;
  height: 64px;
  flex-shrink: 0;
}

.title {
  margin: 0 auto;
  font-size: 1.5rem;
}

.content {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  background: #f5f5f5;
  padding: 16px;
  overflow-y: auto;
  border-right: 1px solid #ddd;
}

.no-sheets {
  color: #777;
  font-style: italic;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sheet-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  align-items: center;
}

.load-btn {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  text-align: left;
  padding: 4px;
  font-size:16px;
  font-weight: bold;
}

.load-btn:hover {
  text-decoration: underline;
}

.delete-btn { 
  border: none;
  color: red;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 24px;
}

.delete-btn:hover {
  background: #b00020;
}

.sheet-wrapper {
  flex-grow: 1;
  padding: 16px;
  overflow: auto;
}

.hot-container {
  border: 1px solid #ccc;
  height: 100%;
}
</style>
