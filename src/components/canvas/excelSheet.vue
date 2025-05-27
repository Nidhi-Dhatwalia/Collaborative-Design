<template>
  <div class="sheet-app">
    <!-- Navbar -->
    <header class="navbar">
      
      <router-link to="/home" > 
      <v-icon color=white> mdi-arrow-left </v-icon>
       </router-link>
      <h1 class="title">Excel Sheet</h1>
      <button class="save-button" @click="handleSave"> Save </button>
    </header>

    <!-- Sheet Container -->
    <div class="sheet-wrapper">
      <div ref="hotContainer" class="hot-container"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
 
import { db } from "@/firebase";
import { ref as dbRef, onValue, set,remove  } from "firebase/database";

const hotContainer = ref(null);
let hotInstance = null;

onMounted(() => {
  const firebaseRef = dbRef(db, "sheetData");

  hotInstance = new Handsontable(hotContainer.value, {
    data: Handsontable.helper.createEmptySpreadsheetData(30, 20),
    rowHeaders: true,
    colHeaders: true,
    width: "100%",
    height: "calc(100vh - 64px)",
    rowHeights: 30,
    colWidths: 100,
    licenseKey: "non-commercial-and-evaluation",
    manualColumnResize: true,
    manualRowResize: true,
    contextMenu: true,
    mergeCells: true, 
    dropdownMenu: true,
    filters: true,
    readOnly: false,
    autoWrapRow: true,
    autoWrapCol: true,


    afterChange(changes, source) {
      if (source === "loadData") return;  

      const data = hotInstance.getData();
      set(firebaseRef, data)
        .then(() => {
          console.log("Data auto-saved to Firebase");
        })
        .catch((err) => {
          console.error("Error auto-saving to Firebase:", err);
        });
    },
  });

  //  Load data from Firebase on mount
  onValue(firebaseRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Loaded data from Firebase:");
    if (data && hotInstance) {
      hotInstance.loadData(data);
    }
  });
});

const handleSave = () => {
  const data = hotInstance?.getData();
  if (!data) return;

  // Save to localStorage
  const timestamp = new Date().toISOString();
  const key = `sheetData_${timestamp}`;
  localStorage.setItem(key, JSON.stringify(data));
  alert("Sheet saved successfully!");

  // Clear Handsontable
  const emptyData = Handsontable.helper.createEmptySpreadsheetData(30, 20);
  hotInstance.loadData(emptyData);

  // Remove data from Firebase
  const firebaseRef = dbRef(db, "sheetData");
  remove(firebaseRef)
    .then(() => {
      console.log("Data removed from Firebase after saving.");
    })
    .catch((err) => {
      console.error("Error removing data from Firebase:", err);
    });
};
 


</script>

<style scoped>
.sheet-app {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1976d2;
  color: white;
  padding: 12px 24px;
  height: 64px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0;
  font-size: 1.5rem;
}

.save-button {
  background-color: #ffffff;
  color: #1976d2;
  border: none;
  padding: 8px 16px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.save-button:hover {
  background-color: #f0f0f0;
}

.sheet-wrapper {
  padding: 16px;
}

.hot-container {
  border: 1px solid #ccc;
}
</style>
