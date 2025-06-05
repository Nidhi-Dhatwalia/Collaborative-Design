<template>
  <div class="sheet-app">
    <header class="navbar">
      <router-link to="/home" class="nav-icon">
        <v-icon color="white" size="28">mdi-arrow-left</v-icon>
      </router-link>

      <h1 class="title">Excel Data</h1>

      <router-link to="/sheet">
        <v-btn class="btn-style" elevation="2" rounded>Go to Excel Page</v-btn>
      </router-link>
    </header>

    <div class="content">
 
      <aside class="sidebar">
        <h3>Load Sheets</h3>
        <div v-if="savedSheets.length === 0" class="no-sheets">No saved sheets found</div>
        <ul v-else>
          <li v-for="(sheet, index) in savedSheets" :key="sheet.key" class="sheet-item">
            <button class="load-btn" @click="loadSheet(sheet.key)">
              Excel Sheet {{ index + 1 }}
            </button>
            <v-icon class="delete-btn" @click="deleteSheet(sheet.key)" title="Delete Sheet">mdi-delete</v-icon>
          </li>
        </ul>
      </aside>

 
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

function fetchSavedSheets() {
  savedSheets.value = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("sheetData_")) {
      savedSheets.value.push({ key });
    }
  }
  savedSheets.value.sort((a, b) => (a.key < b.key ? 1 : -1)); 
}

function loadSheet(key) {
  const saved = JSON.parse(localStorage.getItem(key));
  if (saved && hotInstance) {
    hotInstance.loadData(saved.data || []);

    // Clear old styles
    const rowCount = saved.data?.length || 30;
    const colCount = saved.data?.[0]?.length || 20;
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        hotInstance.setCellMeta(row, col, 'className', '');
      }
    }

    // Apply new styles
    if (saved.meta) {
      for (const key in saved.meta) {
        const [row, col] = key.split(":").map(Number);
        hotInstance.setCellMeta(row, col, "className", saved.meta[key]);
      }
    }

    hotInstance.render();
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
  background: #f9fafb;
  color: #222;
}


.navbar {
  display: flex;
  align-items: center;
  background-color: #107c41;
  color: white;
  padding: 0 24px;
  height: 64px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  gap: 16px;
  flex-shrink: 0;
}

.nav-icon {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.nav-icon:hover {
  opacity: 0.8;
}

.title {
  flex-grow: 1;
  font-weight: 700;
  font-size: 1.6rem;
  text-align: center;
  user-select: none;
}

.btn-style {
  color: #107c41 !important;
  font-weight: 600;
  text-transform: none !important;
  background-color: #ffffff !important;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.btn-style:hover {
  background-color: #e3f0df !important;
  box-shadow: 0 4px 10px rgb(16 124 65 / 0.3);
}

/* Content Layout */
.content {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  background: white;
  border-top: 1px solid #ddd;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: #f7f9fa;
  padding: 24px 20px;
  border-right: 1px solid #ddd;
  box-shadow: inset -2px 0 4px rgba(0,0,0,0.05);
  overflow-y: auto;
}

.sidebar h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-weight: 700;
  color: #107c41;
  user-select: none;
}

.no-sheets {
  color: #999;
  font-style: italic;
  padding: 8px 0;
}

/* Sheet list */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sheet-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  align-items: center;
  background: #eaf5ec;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  transition: background-color 0.2s ease;
}

.sheet-item:hover {
  background: #d4ecd4;
}

.load-btn {
  background: none;
  border: none;
  color: #107c41;
  cursor: pointer;
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  padding: 0;
  user-select: none;
  transition: color 0.2s ease;
}

.load-btn:hover {
  color: #0b5c20;
  text-decoration: underline;
}

.delete-btn {
  color: #b02a2a;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
  transition: transform 0.2s ease, color 0.2s ease;
}

.delete-btn:hover {
  transform: scale(1.3);
  color: #7a1c1c;
}

/* Sheet display */
.sheet-wrapper {
  flex-grow: 1;
  padding: 24px;
  overflow: auto;
  background: #fff;
  box-shadow: inset 0 0 10px rgb(0 0 0 / 0.05);
  border-radius: 8px;
  margin: 16px;
}

.hot-container {
  border: 1px solid #ccc;
  height: 100%;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
}

/* Style Classes for cells */
.bold {
  font-weight: bold !important;
}

.italic {
  font-style: italic !important;
}

.font-20 {
  font-size: 20px !important;
}
</style>
