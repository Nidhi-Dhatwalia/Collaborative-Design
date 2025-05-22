<template>
  <v-container
    fluid
    class="fill-height d-flex align-center justify-center pa-4"
  >
    <v-card
      class="elevation-12 pa-6 rounded-lg"
      style="max-width: 450px; width: 90%;"
    >
      <v-card-text>
        <v-form ref="form" v-model="formValid" @submit.prevent="handleSignUp">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            :rules="emailRules"
            required
            autocomplete="email"
            outlined
            dense
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
          ></v-text-field>

          <v-btn
            type="submit"
            color="primary"
            class="mt-4"
            :loading="loading"
            :disabled="!formValid"
          >
            Register
          </v-btn>

          <v-alert
            v-if="errorMessage"
            type="error"
            dense
            outlined
            class="mt-4"
          >
            {{ errorMessage }}
          </v-alert>

          <v-alert
            v-if="successMessage"
            type="success"
            dense
            outlined
            class="mt-4"
          >
            {{ successMessage }}
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

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
      (valid) => !!valid || "Email is required.",
      (valid) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valid) || "Must be a valid email address.",
    ];
  

    const passwordRules = [
      (valid) => !!valid || "Password is required.",
      (valid) => valid.length >= 6 || "Password must be at least 6 characters.",
 
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

        email.value = "";
        password.value = "";

        router.push("/dashboard");
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
    };
  },
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #4a90e2, #9013fe);
}
</style>
