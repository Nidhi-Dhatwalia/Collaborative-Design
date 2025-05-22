<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <v-card class="pa-5 card-hover" outlined>
      <v-card-title class="text-center">
        <h2 class="headline font-weight-bold">Login</h2>
      </v-card-title>

      <v-form @submit.prevent="login">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          prepend-icon="mdi-email"
          outlined
          dense
          class="mb-4 text-field-hover"
          :rules="emailRules"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          :type="passwordVisible ? 'text' : 'password'"
          prepend-icon="mdi-lock" 
          outlined
          dense
          class="mb-4 text-field-hover"
          @click:append="togglePasswordVisibility"
          :rules="passwordRules"
        ></v-text-field>

        <v-btn
          color="primary"
          block
          type="submit"
          :loading="loading"
          :disabled="loading"
          class="mb-4 btn-hover"
        >
          Login
        </v-btn>

        <v-alert v-if="error" type="error" class="mt-3" dismissible>
          {{ error }}
        </v-alert>

        <v-alert v-if="success" type="success" class="mt-3" dismissible>
          {{ success }}
        </v-alert>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'vue-router';        

const email = ref('');
const password = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);
const passwordVisible = ref(false);

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Please enter a valid email'
];

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters long'
];

const router = useRouter();

const login = async () => {
  error.value = '';
  success.value = '';
  if (!email.value || !password.value) {
    error.value = 'Fill both email and password';
    return;
  }

  loading.value = true;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    console.log('Login Success:', user.email);
    success.value = `Welcome ${user.email}!`;
    router.push({ name: 'Dashboard' });
  } catch (err) {
    console.error('Login Error:', err.message);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
</script>

<style scoped>
.v-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
}

.v-card {
  border-radius: 20px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  padding: 20px;
}

.v-card:hover {
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.15);
}

.v-card-title h2 {
  font-weight: bold;
  font-size: 24px;
}

.v-btn {
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.v-btn:hover {
  background-color: #1976d2;
}

.text-field-hover input {
  transition: border-color 0.3s ease;
}

.v-alert {
  margin-top: 10px;
}
</style>
