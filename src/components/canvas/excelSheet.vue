<template>
  <div class="sheet-app" :class="{ dark: isDark }">
    <!-- Navbar -->
    <header class="navbar">
      <div class="left-controls">
        <router-link to="/home">
          <v-icon color="white">mdi-arrow-left</v-icon>
        </router-link>
        <input class="sheet-title" v-model="sheetTitle" placeholder="Sheet Title" />
      </div>

      <div class="center-label">
        <span class="cell-label">Selected: {{ selectedCell }}</span>
      </div>

      <div class="right-controls">
        <v-btn class="text-btn" @click="applyStyle('bold')">Bold</v-btn>
        <v-btn class="text-btn" @click="applyStyle('italic')">Italic</v-btn>

        <!-- Font Size Dropdown -->
        <v-select
          v-model="selectedFontSize"
          :items="fontSizeOptions"
          label="Font Size"
          density="compact"
          style="max-width: 120px"
          hide-details
          @update:modelValue="applyFontSize"
          class="text-btn"
        />

        <v-btn class="text-btn" @click="handleClear">Clear</v-btn>
        <v-btn class="save-button" @click="handleSave">Save</v-btn>
        <v-btn class="save-button" @click="handleDownload">Download</v-btn>
        <router-link to="/excel">
          <v-btn>Saved Data</v-btn>
        </router-link>
        <v-switch v-model="isDark" inset color="white" hide-details />
      </div>
    </header>

    <!-- Sheet Container -->
    <div class="sheet-wrapper">
      <div ref="hotContainer" class="hot-container"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import * as XLSX from 'xlsx';
import { db } from '@/firebase';
import { ref as dbRef, onValue, set, remove } from 'firebase/database';

const hotContainer = ref(null);
let hotInstance = null;

const sheetTitle = ref("Untitled Sheet");
const selectedCell = ref("A1");
const isDark = ref(false);
const lastSelectedRange = ref(null);
const cellMeta = ref({});

const fontSizeOptions = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
const selectedFontSize = ref('16px');

const fontClasses = [
  'font-12', 'font-14', 'font-16', 'font-18',
  'font-20', 'font-24', 'font-28', 'font-32'
];

 
const getCleanMeta = () => {
  const cleanMeta = {};
  for (const key in cellMeta.value) {
    const [row, col] = key.split(':').map(Number);
    if (
      Number.isInteger(row) && row >= 0 &&
      Number.isInteger(col) && col >= 0
    ) {
      cleanMeta[key] = cellMeta.value[key];
    }
  }
  return cleanMeta;
};

const updateFirebaseMeta = () => {
  const firebaseRef = dbRef(db, 'sheetData');
  set(firebaseRef, {
    data: hotInstance.getData(),
    meta: getCleanMeta()
  });
};

onMounted(() => {
  const firebaseRef = dbRef(db, 'sheetData');

  hotInstance = new Handsontable(hotContainer.value, {
    data: Handsontable.helper.createEmptySpreadsheetData(30, 20),
    rowHeaders: true,
    colHeaders: true,
    width: '100%',
    height: 'calc(100vh - 64px)',
    rowHeights: 30,
    colWidths: 100,
    licenseKey: 'non-commercial-and-evaluation',
    manualColumnResize: true,
    manualRowResize: true,
    contextMenu: true,
    mergeCells: true,
    dropdownMenu: true,
    filters: true,
    comments: true,
    autoWrapRow: true,
    autoWrapCol: true,

    afterChange(changes, source) {
      if (source === 'loadData') return;
      set(firebaseRef, {
        data: hotInstance.getData(),
        meta: getCleanMeta()
      });
    },

    afterSelection(row, col, row2, col2) {
      const colLetter = String.fromCharCode(65 + col);
      selectedCell.value = `${colLetter}${row + 1}`;
      lastSelectedRange.value = [row, col, row2, col2];
    },
  });

   
  onValue(firebaseRef, (snapshot) => {
    const sheet = snapshot.val();
    if (sheet && sheet.data) {
      hotInstance.loadData(sheet.data);

      if (sheet.meta) {
        cellMeta.value = sheet.meta;
        for (const key in sheet.meta) {
          const [row, col] = key.split(':').map(Number);
          if (
            Number.isInteger(row) && row >= 0 &&
            Number.isInteger(col) && col >= 0
          ) {
            hotInstance.setCellMeta(row, col, 'className', sheet.meta[key]);
          } else {
            console.warn(`Invalid meta key ignored: ${key}`);
          }
        }
        hotInstance.render();
      }
    }
  });
});

const applyStyle = (styleClass) => {
  if (!hotInstance || !lastSelectedRange.value) return;
  const [rowStart, colStart, rowEnd, colEnd] = lastSelectedRange.value;

  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) {
      const key = `${row}:${col}`;
      const existing = cellMeta.value[key] || '';
      const classSet = new Set(existing.split(' ').filter(Boolean));
      classSet.add(styleClass);
      const finalClass = Array.from(classSet).join(' ');
      cellMeta.value[key] = finalClass;
      hotInstance.setCellMeta(row, col, 'className', finalClass);
    }
  }
  hotInstance.render();
  updateFirebaseMeta();  
};

const applyFontSize = () => {
  if (!hotInstance || !lastSelectedRange.value) return;
  const [rowStart, colStart, rowEnd, colEnd] = lastSelectedRange.value;
  const fontClass = `font-${selectedFontSize.value.replace('px', '')}`;

  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) {
      const key = `${row}:${col}`;
      const existing = cellMeta.value[key] || '';
      const classSet = new Set(existing.split(' ').filter(Boolean));
      fontClasses.forEach(fc => classSet.delete(fc)); 
      classSet.add(fontClass);
      const finalClass = Array.from(classSet).join(' ');
      cellMeta.value[key] = finalClass;
      hotInstance.setCellMeta(row, col, 'className', finalClass);
    }
  }
  hotInstance.render();
  updateFirebaseMeta();  
};

const handleSave = () => {
  const data = hotInstance?.getData();
  if (!data) return;

  const key = `sheetData_${new Date().toISOString()}`;
  localStorage.setItem(key, JSON.stringify({
    title: sheetTitle.value,
    data,
    meta: getCleanMeta()
  }));

  hotInstance.loadData(Handsontable.helper.createEmptySpreadsheetData(30, 20));
  cellMeta.value = {};
  remove(dbRef(db, 'sheetData'));
  alert("Sheet saved successfully!");
};

const handleClear = () => {
  hotInstance?.loadData(Handsontable.helper.createEmptySpreadsheetData(30, 20));
  cellMeta.value = {};
  updateFirebaseMeta(); 
};

const handleDownload = () => {
  if (!hotInstance) return;
  const data = hotInstance.getData();
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle.value || "Sheet1");
  XLSX.writeFile(workbook, `${sheetTitle.value || 'Sheet'}.xlsx`);
};
</script>



<style>
.sheet-app {
  background-color: #f8f9fa;
  color: #333;
  transition: background 0.3s ease;
  min-height: 100vh;
}

.sheet-app.dark {
  background-color: #121212;
  color: #eee;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #107c41;
  padding: 10px 20px;
  height: 64px;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.left-controls,
.right-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.text-btn {
  border: 1px white;
  background-color: transparent; 
  color: white !important;
  text-transform: none;
  font-weight: 500;
  padding: 4px 10px;
}

.text-btn:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
} 
.center-label {
  flex-grow: 1;
  text-align: center;
  font-weight: bold;
}

.sheet-title {
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
}

.save-button { 
  background-color: #107c41;
  color:  #ffffff;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.save-button:hover {
  background-color: #f1f1f1;
  color: #107c41;
}

.sheet-wrapper {
  padding: 12px;
}

.hot-container {
  border: 1px solid #ccc;
}

/* Font Size Classes */
.font-12 {
  font-size: 12px !important;
}
.font-14 {
  font-size: 14px !important;
}
.font-16 {
  font-size: 16px !important;
}
.font-18 {
  font-size: 18px !important;
}
.font-20 {
  font-size: 20px !important;
}
.font-24 {
  font-size: 24px !important;
}
.font-28 {
  font-size: 28px !important;
}
.font-32 {
  font-size: 32px !important;
}

/* Bold/Italic */
.bold {
  font-weight: bold !important;
}
.italic {
  font-style: italic !important;
}
</style>
