<template>
  <v-container class="resume-editor">
    <v-row justify="center">
      <v-col cols="12">
        <v-text-field
          v-model="header.name"
          label="Full Name"
          outlined
          class="editable-header"
          :readonly="false"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="header.title"
          label="Job Title"
          outlined
          class="editable-subheader"
          :readonly="false"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-subheader class="editable-section-title">Experience</v-subheader>
        <v-card class="experience-item">
          <v-text-field
            v-model="experience.position"
            label="Position"
            outlined
            class="editable-item"
            :readonly="false"
          ></v-text-field>
          <v-textarea
            v-model="experience.details"
            label="Job Description (Bullet Points)"
            outlined
            class="editable-details"
            :readonly="false"
          ></v-textarea>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-btn @click="downloadResume" color="success" class="download-btn" large>
        Download Resume
      </v-btn>
    </v-row>
    <v-row>
      <v-btn @click="goBack" color="primary" outlined class="back-btn">
        Back
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { jsPDF } from "jspdf";

const header = ref({
  name: "John Doe",
  title: "Software Engineer",
});

const experience = ref({
  position: "Frontend Developer at ABC Corp (2022 - Present)",
  details: "- Developed Vue.js apps\n- Collaborated on UI/UX designs\n- Integrated third-party APIs\n- Worked in an Agile environment",
});

const downloadResume = () => {
  const doc = new jsPDF(); 

  const imgPath = 'your-image-url-here';  
  doc.addImage(imgPath, 'JPEG', 15, 15, 30, 30); 

  doc.setFont("helvetica", "bold");   
  doc.setFontSize(20);  
  doc.text(header.value.name, 30, 30);   
  doc.setFontSize(18);  
  doc.text(header.value.title, 20, 40);  

  doc.setDrawColor(0, 0, 0); 
  doc.setLineWidth(0.5);  
  doc.line(20, 45, 190, 45);  

  doc.setFont("times", "bold");   
  doc.setFontSize(22);
  doc.text('Experience', 20, 60);  

  doc.setFontSize(16);
  const details = experience.value.details.split('\n');
  let yPosition = 70;
  details.forEach((line) => {
    doc.text(line, 20, yPosition);
    yPosition += 10; 
  });

  doc.line(20, yPosition + 5, 190, yPosition + 5);  

  doc.save('resume.pdf');  
};

function goBack() {
  window.history.back();  
}
</script>

<style scoped>
.resume-editor {
  font-family: "Arial", sans-serif;
  width: 50vw;
  margin: 50px auto;
  padding: 30px;
  background-color: #f4f7fc;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.editable-header {
  font-size: 36px;
  font-weight: bold;
  color: #333;
}

.editable-subheader {
  font-size: 24px;
  color: #666;
}

.editable-section-title {
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
  padding: 5px 0;
}

.experience-item,
.skills-list {
  margin-bottom: 20px;
}

.editable-item {
  font-size: 18px;
  color: #555;
  margin: 5px 0;
}

.editable-details {
  font-size: 16px;
  color: #777;
  padding-left: 20px;
}

.download-btn {
  font-size: 18px;
  padding: 12px 20px;
  border-radius: 5px;
}
</style>
