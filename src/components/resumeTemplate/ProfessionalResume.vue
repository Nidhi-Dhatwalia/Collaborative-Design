<template>
  <v-container class="resume-editor professional">
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

    <v-row class="section">
      <v-col cols="12" class="vertical-line">
        <v-subheader class="editable-section-title">Professional Experience</v-subheader>
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
            class="editable-details italic"
            :readonly="false"
          ></v-textarea>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="section">
      <v-col cols="12" class="vertical-line">
        <v-subheader class="editable-section-title">Education</v-subheader>
        <v-text-field
          v-model="education"
          label="Degree"
          outlined
          class="editable-item"
          :readonly="false"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row class="section">
      <v-col cols="12" class="vertical-line">
        <v-subheader class="editable-section-title">Skills</v-subheader>
        <v-text-field
          v-model="skills"
          label="Skills"
          outlined
          class="editable-item"
          :readonly="false"
        ></v-text-field>
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
import { ref } from 'vue'
import jsPDF from 'jspdf'  

const header = ref({
  name: 'Jane Smith',
  title: 'Senior Software Engineer'
})

const experience = ref({
  position: 'Lead Developer at XYZ Ltd. (2020 - Present)',
  details: 'Leading a team of developers to create web applications using Vue.js and Node.js.'
})

const education = ref("Bachelor's in Computer Science from ABC University")
const skills = ref("JavaScript, Vue.js, Node.js, MongoDB, Agile methodologies")

function downloadResume() {
  const doc = new jsPDF()
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(20)
  doc.text(header.value.name, 20, 20)
  doc.setFontSize(18)
  doc.text(header.value.title, 20, 30)

  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.line(20, 35, 190, 35)

  doc.setFont('times', 'italic')
  doc.setFontSize(22)
  doc.text('Professional Experience', 20, 50)
  doc.setFontSize(16)
  doc.text(experience.value.position, 20, 60)

  const experienceDetails = experience.value.details.split('\n')
  let yPosition = 70
  experienceDetails.forEach((line) => {
    doc.text(line, 20, yPosition)
    yPosition += 10
  })

  doc.line(20, yPosition + 5, 190, yPosition + 5)
  yPosition += 15

  doc.setFontSize(22)
  doc.text('Education', 20, yPosition)
  yPosition += 10
  doc.setFontSize(16)
  doc.text(education.value, 20, yPosition)

  yPosition += 15
  doc.line(20, yPosition, 190, yPosition)
  yPosition += 10

  doc.setFontSize(22)
  doc.text('Skills', 20, yPosition)
  yPosition += 10
  doc.setFontSize(16)
  doc.text(skills.value, 20, yPosition)

  doc.save('resume.pdf')
}

function goBack() {
  window.history.back()
}
</script>

<style scoped>
.professional {
  font-family: 'Arial', sans-serif;
  width: 60vw;
  margin: 50px auto;
  padding: 30px;
  background-color: #f4f7fc;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.editable-header {
  font-size: 38px;
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
  margin-bottom: 10px;
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

.italic {
  font-style: italic;
}

.section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.vertical-line {
  position: relative;
  padding-left: 20px;
}

.vertical-line::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 3px;
  background-color: #2c3e50;
}

.download-btn {
  font-size: 18px;
  padding: 12px 20px;
  border-radius: 5px;
}

.back-btn {
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
