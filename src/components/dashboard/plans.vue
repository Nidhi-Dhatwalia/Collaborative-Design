<template>
  <v-container class="container" fluid>
    <h2 class="text-h4 font-weight-bold text-center mb-10 ">
      A perfect fit for everyone
    </h2>

    <v-row justify="center">
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="(plan, index) in plans"
        :key="index"
      >
        <v-card
          class="pa-6 d-flex flex-column justify-space-between"
          :style="{ backgroundColor: '#e4d3ed' }"
          elevation="6"
        >
          <div>
            <p class="text-subtitle-1 font-weight-medium text-grey-darken-2 mb-2">
              {{ plan.header }}
            </p>
            <h4 class="text-h6 font-weight-bold mb-3" style="color: #7b44a8">
              {{ plan.title }}
            </h4>
            <p class="text-body-2 text-grey-darken-1 mb-4">
              {{ plan.description }}
            </p>
          </div>
          <v-btn
            class="cta-button white--text text-none"
            rounded
            large
          >
            {{ plan.cta }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      plans: [
        {
          header: "For One Person",
          title: "Canva Free",
          description: "For designing or working on anything.",
          cta: "Get Canva Free",
        },
        {
          header: "For One Person",
          title: "Canva Pro",
          description:
            "For growing your brand or passion project with premium features.",
          cta: "Start Free Pro trial",
        },
        {
          header: "For your team",
          title: "Canva Teams",
          description:
            "For teams to create together with premium workplace tools and workflows.",
          cta: "Start Free Teams trial",
        },
        {
          header: "For your organisation",
          title: "Canva Enterprise",
          description:
            "For organisations to unite and manage their teams, brands, and designs",
          cta: "Contact Sales",
        },
      ],
    };
  },
};
</script>

<style scoped>
.container {
  margin-top: 50px;
  width: 90%; 
  padding: 0; 
}

.text-none {
  text-transform: none;
}

.v-card {
  height: 100%;
  width: 100%; 
}

.v-col {
  display: flex;
  justify-content: space-between;
}

.v-card .v-btn {
  margin-top: auto;
}

.v-col {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
 
}

.v-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.v-btn {
  transition: background-color 0.3s ease;
  width: auto;
  background-color: rgb(187, 74, 202);
  color: white;
}

.v-btn:hover {
  background-color: #9c4d91 !important;
}
</style>
