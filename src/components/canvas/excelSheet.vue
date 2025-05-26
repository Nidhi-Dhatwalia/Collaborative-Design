<template>
  <v-app>
     <sideBar />
      <v-app-bar>
      <v-toolbar fluid class="gradient-toolbar px-6 ">
        
      <v-row align="center" justify="space-evenly" >
      <div class="text-h5 white--text " >Excel Style Sheet </div>
 
      <div>
         <v-btn
          @click="toggleBold"
          :color="cellStyles[selectedCell.row]?.[selectedCell.col]?.isBold ? 'black' : 'blue'"
          class="format-btn"
          small
          >Bold</v-btn
        >
      </div>
      <div>
        <v-btn
          @click="toggleItalic"
          :color="cellStyles[selectedCell.row]?.[selectedCell.col]?.isItalic ? 'black' : 'blue'"
          class="format-btn"
          small
          >Italic</v-btn
        >
      </div>
      <div>
        <v-btn
          @click="toggleUnderline"
          :color="cellStyles[selectedCell.row]?.[selectedCell.col]?.isUnderline ? 'black' : 'blue'"
          class="format-btn"
          small
          >Underline</v-btn
        >
      </div>
      <div>
        <v-select
          v-model="fontSize"
          :items="fontSizes"
          label="Font Size"
          dense
          class="format-select"
          hide-details
        />
      </div>
      <div>
        <v-select
          v-model="alignment"
          :items="alignments"
          label="Align"
          dense
          class="format-select"
          hide-details
        />
      </div><div>
        <v-btn class="btn-style" text  @click="saveToLocalStorage">Save</v-btn> 
      </div>
    </v-row>
  </v-toolbar>
    </v-app-bar>
    <v-container fluid class="pa-0">
      <div class="toolbar">
      
      </div>

      <div
        v-if="selectedCell.row !== null && selectedCell.col !== null"
        class="format-toolbar"
      >
       
     
      </div>

      <div class="excel-wrapper">
        <div class="row header-row">
          <div class="cell row-header"></div>
          <div class="cell col-header" v-for="col in colLabels" :key="col">
            {{ col }}
          </div>
        </div>

        <div class="row" v-for="(row, rowIndex) in rows" :key="rowIndex">
          <div class="cell row-header">{{ rowIndex + 1 }}</div>
          <div
            class="cell"
            v-for="(col, colIndex) in cols"
            :key="colIndex"
            :class="{
              selected:
                selectedCell.row === rowIndex && selectedCell.col === colIndex,
            }"
          >
            <input
              type="text"
              v-model="sheetData[rowIndex][colIndex]"
              class="cell-input"
              :style="{
                fontWeight:
                  cellStyles[rowIndex]?.[colIndex]?.isBold ? 'bold' : 'normal',
                fontStyle:
                  cellStyles[rowIndex]?.[colIndex]?.isItalic ? 'italic' : 'normal',
                textDecoration:
                  cellStyles[rowIndex]?.[colIndex]?.isUnderline
                    ? 'underline'
                    : 'none',
                fontSize:
                  cellStyles[rowIndex]?.[colIndex]?.fontSize + 'px' || '16px',
                textAlign: cellStyles[rowIndex]?.[colIndex]?.alignment || 'center',
              }"
              @click="selectCell(rowIndex, colIndex)"
              @input="autoSaveCell(rowIndex, colIndex)"
            />

        
          </div>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { db } from "@/firebase";
import { ref as dbRef, set, onValue } from "firebase/database";
import sideBar from "@/composables/sideBar.vue";

const rows = 50;
const cols = 26;
const colLabels = Array.from({ length: cols }, (_, i) =>
  String.fromCharCode(65 + i)
);

const sheetData = ref([]);
const cellStyles = ref([]);

for (let i = 0; i < rows; i++) {
  sheetData.value.push(Array.from({ length: cols }, () => ""));
  cellStyles.value.push(
    Array.from({ length: cols }, () => ({
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: 16,
      alignment: "center",
    }))
  );
}

onMounted(() => {
  const dataRef = dbRef(db, "sheetData");
  const styleRef = dbRef(db, "cellStyles");

  onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      const fetchedData = snapshot.val();
      sheetData.value = Array.from({ length: rows }, (_, i) =>
        fetchedData[i] || Array(cols).fill("")
      );
    }
  });

  onValue(styleRef, (snapshot) => {
    if (snapshot.exists()) {
      const fetchedStyles = snapshot.val();
      cellStyles.value = Array.from({ length: rows }, (_, i) =>
        fetchedStyles[i] ||
        Array.from({ length: cols }, () => ({
          isBold: false,
          isItalic: false,
          isUnderline: false,
          fontSize: 16,
          alignment: "center",
        }))
      );
    }
  });
});

const selectedCell = ref({ row: null, col: null });

const selectCell = (row, col) => {
  selectedCell.value = { row, col };

  if (!cellStyles.value[row]) {
    cellStyles.value[row] = [];
  }
  if (!cellStyles.value[row][col]) {
    cellStyles.value[row][col] = {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: 16,
      alignment: "center",
    };
  }

  fontSize.value = cellStyles.value[row][col].fontSize || 16;
  alignment.value = cellStyles.value[row][col].alignment || "center";
};

const fontSizes = [12, 14, 16, 18, 20, 24];
const fontSize = ref(16);

watch(fontSize, (newSize) => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    cellStyles.value[row][col].fontSize = newSize;
    set(dbRef(db, `cellStyles/${row}/${col}/fontSize`), newSize);
  }
});

const alignments = ["left", "center", "right"];
const alignment = ref("center");

watch(alignment, (newAlign) => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    cellStyles.value[row][col].alignment = newAlign;
    set(dbRef(db, `cellStyles/${row}/${col}/alignment`), newAlign);
  }
});

const toggleBold = () => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    const newBold = !cellStyles.value[row][col].isBold;
    cellStyles.value[row][col].isBold = newBold;
    set(dbRef(db, `cellStyles/${row}/${col}/isBold`), newBold);
  }
};

const toggleItalic = () => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    const newItalic = !cellStyles.value[row][col].isItalic;
    cellStyles.value[row][col].isItalic = newItalic;
    set(dbRef(db, `cellStyles/${row}/${col}/isItalic`), newItalic);
  }
};

const toggleUnderline = () => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    const newUnderline = !cellStyles.value[row][col].isUnderline;
    cellStyles.value[row][col].isUnderline = newUnderline;
    set(dbRef(db, `cellStyles/${row}/${col}/isUnderline`), newUnderline);
  }
};

const autoSaveCell = (row, col) => {
  const value = sheetData.value[row][col];

  if (!cellStyles.value[row]) {
    cellStyles.value[row] = [];
  }
  if (!cellStyles.value[row][col]) {
    cellStyles.value[row][col] = {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: 16,
      alignment: "center",
    };
  }

  if (value === "") {
    cellStyles.value[row][col] = {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: 16,
      alignment: "center",
    };
    set(dbRef(db, `cellStyles/${row}/${col}`), cellStyles.value[row][col]);
  }

  set(dbRef(db, `sheetData/${row}/${col}`), value);
};
const saveToLocalStorage = () => {
 
  const timestamp = new Date().toISOString(); 
  localStorage.setItem(`excelSheetData_${timestamp}`, JSON.stringify(sheetData.value));
  localStorage.setItem(`excelCellStyles_${timestamp}`, JSON.stringify(cellStyles.value));

  alert("Sheet saved !"); 

    set(dbRef(db, "sheetData"), null);
  set(dbRef(db, "cellStyles"), null);

  // Clear all cells
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      sheetData.value[i][j] = "";
      cellStyles.value[i][j] = {
        isBold: false,
        isItalic: false,
        isUnderline: false,
        fontSize: 16,
        alignment: "center",
      };
    }
  }

  // Clear selection
  selectedCell.value = { row: null, col: null };
};

  </script>

<style scoped>
 
.gradient-toolbar {
  background: linear-gradient(90deg, #01c2cc, #397dd9,#7a41e6);  
  color: white;

}

.btn-style{
  background-color: #d1cbda;
  color: black;
  margin-right: 10px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-left: 120px;
  background-color: #f5f5f5;
}
.format-toolbar {
  display: flex;
  gap: 10px;
  margin: 40px 10px 12px 180px;
  align-items: center;
}

.format-btn {
  font-size: 14px;
  min-width: 60px;
  height: 32px;
  background-color: #d1cbda;
  color: black;
  font-weight: bold;
}

.format-select {
  width: 120px;
}
.excel-wrapper {
  margin-top: 30px; 
  height: calc(100vh - 140px);
  overflow: auto;
  border: 1px solid #ccc;
  margin-left: 140px;
  min-width: 100%;
  box-sizing: border-box;
}
.row {
  display: flex;
  min-width: max-content;
  flex-wrap: nowrap;
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
  box-sizing: border-box;
  background: transparent;
  font-family: Arial, sans-serif;
}
.row-header {
  background-color: #dcd6f7;
 
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.col-header {
  background-color: #dcd6f7;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.selected {
  border: 2px solid #1976d2;
  padding: 3px;
  background-color: #e3f2fd;
}
</style>
