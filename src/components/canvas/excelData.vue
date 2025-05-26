<template>
  <v-container class="pa-4" fluid>



    <v-row>
      <!-- Sidebar with saved sheets list -->
      <v-col cols="12" md="4" class="sidebar">
        <div v-if="savedSheets.length === 0" class="no-sheets-msg">
          <p>No saved sheets found.</p>
        </div>

        <v-list dense>
              <h2 class="text-h5 font-weight-bold mb-4">Saved Excel Sheets</h2>
          <v-list-item
            v-for="(sheet, index) in savedSheets"
            :key="sheet.key"
            class="mb-2 rounded-md transition-all"
            :class="{ 'selected': selectedSheetKey === sheet.key }"
            elevation="1"
          >
            <div
              class="design-item d-flex justify-space-between align-center w-100"
              @click="loadSheet(sheet.key)"
            >
              <div class="design-title font-weight-medium">
                Sheet {{  index + 1 }}
              </div>
              <v-icon
                color="red"
                class="delete-icon"
                @click.stop="deleteSheet(sheet.key)"
                aria-label="Delete sheet"
              >
                mdi-delete
              </v-icon>
              
            </div>
          </v-list-item>
    <v-btn color="secondary" class="mb-4" @click="goBack"> <v-icon > mdi-arrow-left   </v-icon>   Back </v-btn>
        </v-list>
      </v-col>

      <!-- Main content area -->
      <v-col cols="12" md="8" class="main-content">
        <div v-if="sheetData.length" class="excel-wrapper">
          <div class="row header-row">
            <div class="cell row-header"></div>
            <div class="cell col-header" v-for="col in colLabels" :key="col">
              {{ col }}
            </div>
          </div>

          <div class="row" v-for="(row, rowIndex) in sheetData" :key="rowIndex">
            <div class="cell row-header">{{ rowIndex + 1 }}</div>
            <div
              class="cell"
              v-for="(col, colIndex) in colLabels"
              :key="colIndex"
              :style="{
                fontWeight: cellStyles[rowIndex]?.[colIndex]?.isBold ? 'bold' : 'normal',
                fontStyle: cellStyles[rowIndex]?.[colIndex]?.isItalic ? 'italic' : 'normal',
                textDecoration: cellStyles[rowIndex]?.[colIndex]?.isUnderline ? 'underline' : 'none',
                fontSize: (cellStyles[rowIndex]?.[colIndex]?.fontSize || 16) + 'px',
                textAlign: cellStyles[rowIndex]?.[colIndex]?.alignment || 'center',
              }"
            >
              {{ row[colIndex] || '' }}
            </div>
          </div>
        </div>

        <div v-else class="empty-message">
          <p>Choose a sheet to see it.</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const savedSheets = ref([]);
const sheetData = ref([]);
const cellStyles = ref([]);
const selectedSheetKey = ref(null);

const colLabels = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const fetchSavedSheets = () => {
  savedSheets.value = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("excelSheetData_")) {
      savedSheets.value.push({
        key,
        date: new Date(key.replace("excelSheetData_", "")).toLocaleString(),
      });
    }
  }

  savedSheets.value.reverse();
};

const loadSheet = (key) => {
  selectedSheetKey.value = key;

  const data = localStorage.getItem(key);
  const styleKey = key.replace("excelSheetData_", "excelCellStyles_");
  const styles = localStorage.getItem(styleKey);

  if (data) {
    try {
      sheetData.value = JSON.parse(data);
    } catch (e) {
      sheetData.value = [];
      console.error("Error parsing sheet data", e);
    }
  } else {
    sheetData.value = [];
  }

  if (styles) {
    try {
      cellStyles.value = JSON.parse(styles);
    } catch (e) {
      cellStyles.value = [];
      console.error("Error parsing cell styles", e);
    }
  } else {
    cellStyles.value = [];
  }
};

const deleteSheet = (key) => {
  const styleKey = key.replace("excelSheetData_", "excelCellStyles_");

  localStorage.removeItem(key);
  localStorage.removeItem(styleKey);

  if (selectedSheetKey.value === key) {
    sheetData.value = [];
    cellStyles.value = [];
    selectedSheetKey.value = null;
  }

  fetchSavedSheets();
};

const goBack = () => {
  router.push("/sheet");
};

onMounted(fetchSavedSheets);
</script>



<style scoped>
/* Sidebar styling */
.sidebar {
  border-right: 1px solid #ddd;
  max-height: 75vh;
  max-width: 280px;
  overflow-y: auto;
  padding-right: 12px;
  background: #fafafa;
  box-shadow: inset -2px 0 5px -2px rgba(0,0,0,0.1);
  border-radius: 0 8px 8px 0;
}

/* Main content styling */
.main-content {
  max-height: 75vh;
  overflow: auto;
  padding-left: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgb(0 0 0 / 0.05);
}

/* Excel wrapper styling */
.excel-wrapper {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  user-select: none;
  border: 1px solid #ccc;
  min-height: 400px;
  border-radius: 8px;
  background: white;
  box-shadow: inset 0 0 10px #eee;
  padding: 8px;
}

/* Row styling */
.row {
  display: flex;
  min-width: max-content;
}

/* Cell styling */
.cell {
  border: 1px solid #ddd;
  width: 140px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  background-color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.cell:hover {
  background-color: #f9f9f9;
}

/* Header cells */
.row-header,
.col-header {
  background-color: #f5f5f5;
  font-weight: 700;
  font-size: 0.9rem;
  color: #333;
}

/* List item selected */
.v-list-item.selected {
  background-color: #d1e9ff !important;
  border-left: 4px solid #1976d2;
  transition: background-color 0.3s ease;
}

/* List item hover */
.v-list-item:hover {
  background-color: #e3f2fd;
  cursor: pointer;
}

/* Design item container */
.design-item {
  cursor: pointer;
  user-select: none;
  padding: 10px 16px;
  border-radius: 10px;
  transition: background-color 0.3s, box-shadow 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-shadow: 0 0 0 transparent;
}

.design-item:hover {
  background-color: #bbdefb;
  box-shadow: 0 4px 10px rgba(25, 118, 210, 0.3);
}

/* Title text */
.design-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0d47a1;
}

/* Delete icon styling */
.delete-icon {
  cursor: pointer;
  font-size: 22px;
  transition: color 0.2s ease;
  color: #e53935;
  user-select: none;
}

.delete-icon:hover {
  color: #b00020;
}

/* Empty message */
.empty-message {
  font-size: 1.2rem;
  font-weight: 600;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  user-select: none;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
 
</style>
