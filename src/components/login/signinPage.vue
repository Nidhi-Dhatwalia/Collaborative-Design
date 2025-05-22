<template>
  <v-container
    class="fill-height d-flex align-center justify-center pa-4"
    fluid
  >
    <v-card
      class="elevation-12 pa-6 rounded-lg"
      :style="{ maxWidth: cardMaxWidth + 'px', width: '90%' }"
    >
      <v-card-title class="text-h5 font-weight-bold justify-center">
        Sign In
      </v-card-title>

      <v-card-text>
        <v-text-field
          label="Email"
          v-model="email"
          type="email"
          required
          outlined
          dense
          prepend-inner-icon="mdi-email"
          class="mb-4"
          :style="{ width: '100%' }"
        />
        <v-text-field
          label="Password"
          v-model="password"
          type="password"
          required
          outlined
          dense
          prepend-inner-icon="mdi-lock"
          class="mb-4"
          :style="{ width: '100%' }"
        />
        <v-alert
          v-if="errorMessage"
          type="error"
          dense
          outlined
          class="mb-4"
          border="left"
        >
          {{ errorMessage }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn
          color="primary"
          large
          rounded
          class="text-none"
          @click="handleSignIn"
          :style="{ width: '100%' }"
        >
          Sign In
          <v-icon right>mdi-login</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleSignIn = async () => {
  errorMessage.value = "";
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;
    alert(`Welcome! User ID: ${user.uid}`);
  } catch (error) {
    errorMessage.value = error.message;
  }
};

const cardMaxWidth = ref(400);

const updateCardWidth = () => {
  if (window.innerWidth < 450) {
    cardMaxWidth.value = window.innerWidth * 0.9;
  } else if (window.innerWidth < 600) {
    cardMaxWidth.value = 400;
  } else {
    cardMaxWidth.value = 450;
  }
};

onMounted(() => {
  updateCardWidth();
  window.addEventListener("resize", updateCardWidth);
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #4a90e2, #9013fe);
}
</style>
