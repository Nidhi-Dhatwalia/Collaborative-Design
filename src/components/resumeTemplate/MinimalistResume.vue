<template>
  <v-container class="resume-editor" fluid>
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
        <v-divider></v-divider>
        <v-text class="editable-section-title">Experience</v-text>
        <v-divider></v-divider>
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
            label="Job Description"
            outlined
            class="editable-details"
            :readonly="false"
          ></v-textarea>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-divider></v-divider>
        <v-text class="editable-section-title">Skills</v-text>
        <v-divider></v-divider>
        <v-textarea
          v-model="skills"
          label="Skills"
          outlined
          class="editable-item"
          :readonly="false"
        ></v-textarea>
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
import { ref } from 'vue';
import { jsPDF } from 'jspdf';

const header = ref({
  name: 'John Doe',
  title: 'Web Developer'
});

const experience = ref({
  position: 'Frontend Developer at ABC Corp.',
  details: 'Developed user interfaces using HTML, CSS, and JavaScript.'
});

const skills = ref('HTML, CSS, JavaScript, Vue.js, React');

const downloadResume = () => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text(header.value.name, 20, 20);
  doc.setFontSize(20);
  doc.text(header.value.title, 20, 30);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text('Experience', 20, 50);

  doc.setFontSize(16);
  const experienceDetails = experience.value.details.split('\n');
  let yPosition = 60;
  experienceDetails.forEach((line) => {
    doc.text(line, 20, yPosition);
    yPosition += 10;
  });

  doc.line(20, yPosition + 5, 190, yPosition + 5);

  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text('Skills', 20, yPosition + 15);

  doc.setFontSize(16);
  const skillsList = skills.value.split(', ');
  let skillPosition = yPosition + 25;
  skillsList.forEach((skill, index) => {
    doc.text(`• ${skill}`, 20, skillPosition);
    skillPosition += 10;
  });

  doc.line(20, skillPosition + 5, 190, skillPosition + 5);

  const currentDate = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.text(`Generated on: ${currentDate}`, 20, skillPosition + 15);

  doc.save('resume.pdf');
};

function goBack() {
  window.history.back();  
}
</script>

<style scoped>
.resume-editor {
  font-family: 'Arial', sans-serif;
  width: 50vw;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.back-btn {
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 5px;
}

.editable-header {
  font-size: 36px;
  font-weight: bold;
  color: #333;
}

.editable-subheader {
  font-size: 24px;
  color: #555;
}

.editable-section-title {
  font-size: 22px;
  font-weight: 600;
  color: #444;
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
