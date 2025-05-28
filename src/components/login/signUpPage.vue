<template>
  <v-container fluid class="fill-height d-flex align-center justify-center pa-4">
    <div class="outer-wrapper">
      <!-- Signup form -->
      <v-card class="signup-section elevation-12" outlined>
        <v-card-text>
          <v-form ref="form" v-model="formValid" @submit.prevent="handleSignUp" class="form-content">
            <h2 class="form-title">Create Your Account</h2>

            <v-text-field
              v-model="email"
              label="Email Address"
              type="email"
              :rules="emailRules"
              required
              autocomplete="email"
              outlined
              dense
              class="input-field"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              :rules="passwordRules"
              required
              autocomplete="new-password"
              outlined
              dense
              class="input-field"
            ></v-text-field>

            <v-btn
              type="submit"
              color="primary"
              class="submit-btn"
              :loading="loading"
              :disabled="!formValid"
              large
            >
              Register
            </v-btn>

            <v-alert v-if="errorMessage" type="error" dense outlined class="mt-4">
              {{ errorMessage }}
            </v-alert>

            <v-alert v-if="successMessage" type="success" dense outlined class="mt-4">
              {{ successMessage }}
            </v-alert>

            <div class="login">
              <span>New to the platform? </span>
              <router-link to="/login" class="login-link">Login</router-link>
            </div>
          </v-form>
        </v-card-text>
      </v-card>

      <div class="welcome-section">
        <v-img :src="signupImage" alt="Welcome illustration" class="welcome-image" />
        <h2 class="welcome-text">Welcome to Our Platform</h2>
        <p class="welcome-subtext">
          Join thousands of professionals who trust us to build their future. Create your account to
          get started with powerful features designed to grow your success.
        </p>
      </div>
    </div>
  </v-container>
</template>

<script>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import signupImage from "@/assets/signup_image.jpg";

export default {
  name: "signUpPage",
  setup() {
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");
    const loading = ref(false);
    const formValid = ref(false);
    const form = ref(null);

    const emailRules = [
      (v) => !!v || "Email is required",
      (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email must be valid",
    ];

    const passwordRules = [
      (v) => !!v || "Password is required",
      (v) => v.length >= 6 || "Password must be at least 6 characters",
    ];

    const auth = getAuth();
const handleSignUp = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  const isValid = form.value?.validate();
  if (!isValid) return;

  loading.value = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    );
    successMessage.value = "Registration successful! You can now sign in.";
    console.log("Registered user:", userCredential.user);

    // Clear fields
    email.value = "";
    password.value = "";

    // Delay for 2 seconds to show success message, then redirect to login page
    setTimeout(() => {
      successMessage.value = "";
      router.push("/login");
    }, 2000);

  } catch (error) {
    console.error("Registration failed:", error);
    errorMessage.value = error.message || "Registration failed.";
  } finally {
    loading.value = false;
  }
};

    return {
      email,
      password,
      errorMessage,
      successMessage,
      loading,
      handleSignUp,
      emailRules,
      passwordRules,
      formValid,
      form,
      signupImage,
    };
  },
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: #f3f3f3;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
}

.outer-wrapper {
  display: flex;
  max-width: 1000px;
  width: 90%;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

 
.signup-section {
  flex: 1;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  border-right: 1px solid #e0e0e0;
}

.form-content {
  width: 100%;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #1a1a1a;
  user-select: none;
}

.input-field {
  margin-bottom: 20px;
  font-size: 1rem;
}

 
.submit-btn {
  width: 100%;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 8px;
  text-transform: none;
  letter-spacing: 0.02em;
}

 
.welcome-section {
  flex: 1;
  background: linear-gradient(135deg, #8338ec, #3a86ff);
  color: #fff;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.welcome-image {
  width: 280px;
  max-width: 100%;
  border-radius: 14px;
  margin: 0 auto 30px auto;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
  user-select: none;
}

.welcome-text {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  user-select: none;
}

.welcome-subtext {
  font-size: 1.1rem;
  line-height: 1.5;
  max-width: 320px;
  margin: 0 auto;
  font-weight: 400;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  user-select: none;
}

.v-alert {
  font-size: 0.9rem;
  border-radius: 8px;
}

.login {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  color: #555;
}

.login-link {
  color: #6a11cb;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}

 
@media (max-width: 900px) {
  .outer-wrapper {
    flex-direction: column;
    box-shadow: none;
    border-radius: 0;
  }

  .signup-section,
  .welcome-section {
    padding: 36px 24px;
    border-right: none !important;
    border-radius: 0;
  }

  .welcome-section {
    order: -1;  
    padding-bottom: 40px;
  }

  .welcome-image {
    width: 220px;
    margin-bottom: 20px;
  }

  .welcome-text {
    font-size: 2rem;
  }
}
</style>
