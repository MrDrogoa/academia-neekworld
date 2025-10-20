<template>
  <v-card class="dashboard-card">
    <v-card-title class="text-h6 txt-profile">
      <v-icon class="me-2">mdi-lightning-bolt</v-icon>
      Acciones Rápidas
    </v-card-title>
    <v-card-text>
      <div class="d-grid gap-2">
        <v-btn
          v-for="(action, i) in actions"
          :key="i"
          :to="action.to"
          block
          class="mb-2 btn-action-1 text-decoration-none text-white fw-semibold"
        >
          <v-icon start>{{ action.icon }}</v-icon>
          {{ action.title }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "DashboardQuickActionsCard",

  props: {
    actions: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.dashboard-card {
  height: 100%;
}

/* Prevent visual jump on hover: remove transform/translation and shadow changes */
.dashboard-card {
  height: 100%;
  transform: none !important;
  transition: none !important;
  will-change: auto;
}

.dashboard-card:hover {
  transform: none !important;
}

.btn-action-1 {
  background-color: #29acb9;
}

.btn-action-1:hover {
  background-color: #32c4d2;
  transform: translateY(-5px);
  box-shadow: 0 4px 12px #32c4d2;
}

.d-grid {
  display: grid;
}

.gap-2 {
  gap: 8px;
}
</style>
