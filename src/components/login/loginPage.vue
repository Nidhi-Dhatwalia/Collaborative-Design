<template>
  <v-container fluid class="login-page pa-0">
    <div class="outer-wrapper">
      <!-- Login form div -->
      <div class="login-section">
        <v-card class="pa-8 login-card" outlined>
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
              color="deep-purple accent-2"
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

            <div class="signup">
              <span>New to the platform ?    </span>
              <router-link to="/signup" class="signup-link">Sign up now.</router-link>
            </div>
                 <router-link to="/">  Back to Dashboard  </router-link>
          </v-form>
        </v-card>
      </div>


      <div class="welcome-section">
        <V-img
          :src="loginImage"
          alt="Welcome"
          class="welcome-image"
        />
        <h2 class="welcome-text">Welcome Back!</h2>
        <p class="welcome-subtext">
          We're happy to see you again. Please login to continue your journey.
        </p>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'vue-router';
import loginImage from '@/assets/login_image.jpg';

const email = ref('');
const password = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);
const passwordVisible = ref(false);

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Please enter a valid email',
];

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters long',
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
    router.push({ name: 'homePage' });
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
.login-page {
  height: 100vh; 
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
    background: #f3f3f3;
}
.btn-style {
  background-color: #4a0fc7;
  color: white;
  margin-top: 20px;
}

.outer-wrapper {
  display: flex;
  width: 90%;
  max-width: 1000px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.login-section,
.welcome-section {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  
}

.login-section {
  background: #fff;
  color: #333;
}

.login-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: none;
}

.welcome-section {
  background: linear-gradient(135deg, #ab88d1 0%, #5181d4 100%);
  color: white;
  text-align: center;
}

.welcome-image {
  max-width: 300px;
  width: 100%;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  object-fit: cover;
  align-self: center;
}

.welcome-text {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.welcome-subtext {
  font-size: 1.2rem;
  max-width: 320px;
  margin: 0 auto;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
}

.v-btn {
  margin-top: 20px;
  transition: background-color 0.3s ease;
  color: #fff !important;
}

.v-btn:hover {
  background-color: #4a0fc7 !important;
}

.text-field-hover input {
  transition: border-color 0.3s ease;
}

.signup {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  color: #555;
}

.signup-link {
  color: #6a11cb;
  text-decoration: none;
  font-weight: 600;
}

.signup-link:hover {
  text-decoration: underline;
}

 
@media (max-width: 900px) {
  .outer-wrapper {
    flex-direction: column;
  }
  .login-section,
  .welcome-section {
    padding: 30px 20px;
  }
  .welcome-image {
    max-width: 250px;
  }
}
</style>
