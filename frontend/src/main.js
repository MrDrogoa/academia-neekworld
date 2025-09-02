import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// Configurar Axios para pagos
const apiBaseURL =
  process.env.VUE_APP_API_BASE_URL ||
  "https://us-central1-academy-bd619.cloudfunctions.net/api";
axios.defaults.baseURL = apiBaseURL;

// Interceptor para logging (desarrollo)
if (process.env.NODE_ENV === "development") {
  axios.interceptors.request.use((request) => {
    console.log(
      "🌐 API Request:",
      request.method?.toUpperCase(),
      request.url,
      request.data
    );
    return request;
  });

  axios.interceptors.response.use(
    (response) => {
      console.log("✅ API Response:", response.status, response.data);
      return response;
    },
    (error) => {
      console.error(
        "❌ API Error:",
        error.response?.status,
        error.response?.data || error.message
      );
      return Promise.reject(error);
    }
  );
}

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

// Accessibility CSS - Global styles for accessibility features
import "@/assets/css/accessibility.css";

// Create Vuetify instance with all components
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#2E8B57",
          secondary: "#424242",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          background: "#FFFFFF",
          surface: "#FFFFFF",
          "on-primary": "#FFFFFF",
          "on-secondary": "#FFFFFF",
          "on-surface": "#000000",
          "on-background": "#000000",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#4CAF50",
          secondary: "#616161",
          accent: "#64B5F6",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          background: "#121212",
          surface: "#1E1E1E",
          "on-primary": "#000000",
          "on-secondary": "#FFFFFF",
          "on-surface": "#FFFFFF",
          "on-background": "#FFFFFF",
        },
      },
    },
  },
  // Configuraciones de accesibilidad
  defaults: {
    VBtn: {
      style: "text-transform: none;",
    },
    VTooltip: {
      activator: "hover",
      openDelay: 500,
      closeDelay: 200,
      location: "bottom",
    },
  },
  // Ensure icons are properly configured
  icons: {
    defaultSet: "mdi",
  },
});

// Create and mount app with plugins
const app = createApp(App);

// Configurar axios como propiedad global
app.config.globalProperties.$http = axios;

// Use plugins
app.use(store);
app.use(router);
app.use(vuetify);

// Mount the application
app.mount("#app");

// Global error handler
app.config.errorHandler = (err) => {
  console.error("Error global:", err);
};
